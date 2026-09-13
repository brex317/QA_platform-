using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using QA_Platform.Application.Help.DTOs;
using QA_Platform.Application.Help.Interfaces;
using QA_Platform.Domain.Entities.Help;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class HelpService : IHelpService
{
    private readonly QAPlatformDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly ILogger<HelpService> _logger;

    public HelpService(
        QAPlatformDbContext context,
        IMemoryCache cache,
        ILogger<HelpService> logger)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
    }

    public async Task<HelpResponseDto?> GetPageHelpAsync(string nodeKey)
    {
        if (string.IsNullOrWhiteSpace(nodeKey))
        {
            return null;
        }

        string cleanKey = nodeKey.Trim();
        string cacheKey = $"help_page_{cleanKey.ToLowerInvariant()}";

        if (_cache.TryGetValue(cacheKey, out HelpResponseDto? cachedHelp) && cachedHelp != null)
        {
            return cachedHelp;
        }

        var node = await _context.NavNodes
            .AsNoTracking()
            .FirstOrDefaultAsync(n => n.Key == cleanKey);

        if (node == null)
        {
            _logger.LogWarning("NavNode not found for nodeKey '{NodeKey}'", cleanKey);
            return null;
        }

        // 1. Try to find 'page' help on target node
        var helpHeader = await _context.HelpHeaders
            .AsNoTracking()
            .Include(h => h.Steps)
            .FirstOrDefaultAsync(h => h.NodeId == node.Id && h.ContextKey == "page" && h.IsActive);

        // 2. If not found on target node, walk up parent chain
        long? currentParentId = node.ParentId;
        while (helpHeader == null && currentParentId.HasValue)
        {
            var parentNode = await _context.NavNodes
                .AsNoTracking()
                .FirstOrDefaultAsync(n => n.Id == currentParentId.Value);

            if (parentNode == null) break;

            helpHeader = await _context.HelpHeaders
                .AsNoTracking()
                .Include(h => h.Steps)
                .FirstOrDefaultAsync(h => h.NodeId == parentNode.Id && h.ContextKey == "page" && h.IsActive);

            currentParentId = parentNode.ParentId;
        }

        if (helpHeader == null)
        {
            _logger.LogInformation("No page help header found for nodeKey '{NodeKey}' or any ancestor", cleanKey);
            return new HelpResponseDto
            {
                NodeKey = cleanKey,
                ContextKey = "page",
                Steps = new List<HelpStepDto>()
            };
        }

        var steps = helpHeader.Steps
            .OrderBy(s => s.StepNumber)
            .Select(s => new HelpStepDto
            {
                StepNumber = s.StepNumber,
                StepText = s.StepText
            })
            .ToList();

        var response = new HelpResponseDto
        {
            NodeKey = cleanKey,
            ContextKey = "page",
            Steps = steps
        };

        _cache.Set(cacheKey, response, TimeSpan.FromMinutes(5));
        return response;
    }

    public async Task<HelpResponseDto?> GetFormHelpAsync(string nodeKey, string formContext = "add_form")
    {
        if (string.IsNullOrWhiteSpace(nodeKey))
        {
            return null;
        }

        string cleanKey = nodeKey.Trim();
        string cleanContext = string.IsNullOrWhiteSpace(formContext) ? "add_form" : formContext.Trim();
        string cacheKey = $"help_form_{cleanKey.ToLowerInvariant()}_{cleanContext.ToLowerInvariant()}";

        if (_cache.TryGetValue(cacheKey, out HelpResponseDto? cachedHelp) && cachedHelp != null)
        {
            return cachedHelp;
        }

        var node = await _context.NavNodes
            .AsNoTracking()
            .FirstOrDefaultAsync(n => n.Key == cleanKey);

        if (node == null)
        {
            _logger.LogWarning("NavNode not found for nodeKey '{NodeKey}'", cleanKey);
            return null;
        }

        var helpHeader = await _context.HelpHeaders
            .AsNoTracking()
            .Include(h => h.Steps)
            .FirstOrDefaultAsync(h => h.NodeId == node.Id && h.ContextKey == cleanContext && h.IsActive);

        if (helpHeader == null)
        {
            _logger.LogInformation("No form help header found for nodeKey '{NodeKey}' with context '{ContextKey}'", cleanKey, cleanContext);
            return null;
        }

        var steps = helpHeader.Steps
            .OrderBy(s => s.StepNumber)
            .Select(s => new HelpStepDto
            {
                StepNumber = s.StepNumber,
                StepText = s.StepText
            })
            .ToList();

        var response = new HelpResponseDto
        {
            NodeKey = cleanKey,
            ContextKey = cleanContext,
            Steps = steps
        };

        _cache.Set(cacheKey, response, TimeSpan.FromMinutes(5));
        return response;
    }

    public async Task<HelpResponseDto?> GetHelpByNodeKeyAsync(string nodeKey)
    {
        return await GetPageHelpAsync(nodeKey);
    }
}
