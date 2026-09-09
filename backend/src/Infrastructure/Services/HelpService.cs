using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using QA_Platform.Application.Help.DTOs;
using QA_Platform.Application.Help.Interfaces;
using QA_Platform.Application.Navigation.Interfaces;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class HelpService : IHelpService
{
    private readonly QAPlatformDbContext _context;
    private readonly INavigationService _navigationService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<HelpService> _logger;

    public HelpService(
        QAPlatformDbContext context,
        INavigationService navigationService,
        IMemoryCache cache,
        ILogger<HelpService> logger)
    {
        _context = context;
        _navigationService = navigationService;
        _cache = cache;
        _logger = logger;
    }

    public async Task<HelpResponseDto> GetHelpByNodeKeyAsync(string nodeKey)
    {
        if (string.IsNullOrWhiteSpace(nodeKey))
        {
            return new HelpResponseDto { Title = "Help", Steps = new() };
        }

        string cacheKey = $"help_node_{nodeKey.Trim().ToLowerInvariant()}";
        if (_cache.TryGetValue(cacheKey, out HelpResponseDto? cachedHelp) && cachedHelp != null)
        {
            return cachedHelp;
        }

        var response = new HelpResponseDto
        {
            NodeKey = nodeKey,
            Title = "Quick steps",
            Steps = new List<HelpStepDto>()
        };

        try
        {
            var node = await _navigationService.GetNodeByKeyAsync(nodeKey);
            if (node == null)
            {
                return response;
            }

            const string sql = @"
                WITH RECURSIVE ancestors AS (
                    SELECT id, parent_id, depth FROM nav_nodes WHERE id = @targetNodeId
                    UNION ALL
                    SELECT n.id, n.parent_id, n.depth
                    FROM nav_nodes n
                    JOIN ancestors a ON n.id = a.parent_id
                ),
                nearest_match AS (
                    SELECT h.id AS header_id, h.title
                    FROM ancestors a
                    JOIN help_headers h ON h.node_id = a.id AND h.is_active
                    ORDER BY a.depth DESC
                    LIMIT 1
                )
                SELECT nm.title, d.step_number, d.step_text
                FROM nearest_match nm
                JOIN help_details d ON d.help_header_id = nm.header_id
                ORDER BY d.step_number;";

            using var connection = _context.Database.GetDbConnection();
            if (connection.State != ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            using var command = connection.CreateCommand();
            command.CommandText = sql;

            var param = command.CreateParameter();
            param.ParameterName = "@targetNodeId";
            param.Value = node.Id;
            command.Parameters.Add(param);

            using var reader = await command.ExecuteReaderAsync();
            bool headerSet = false;
            while (await reader.ReadAsync())
            {
                if (!headerSet)
                {
                    response.Title = reader.IsDBNull(0) ? "Quick steps" : reader.GetString(0);
                    headerSet = true;
                }

                response.Steps.Add(new HelpStepDto
                {
                    Number = reader.GetInt32(1),
                    Text = reader.GetString(2)
                });
            }

            // Cache result per nodeKey
            _cache.Set(cacheKey, response, TimeSpan.FromMinutes(5));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving help content for nodeKey {NodeKey}", nodeKey);
        }

        return response;
    }
}
