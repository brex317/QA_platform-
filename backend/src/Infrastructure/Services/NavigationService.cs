using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using QA_Platform.Application.Navigation.DTOs;
using QA_Platform.Application.Navigation.Interfaces;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class NavigationService : INavigationService
{
    private readonly QAPlatformDbContext _context;
    private readonly IMemoryCache _cache;
    private const string CacheKey = "NavigationTree";
    private readonly TimeSpan CacheDuration = TimeSpan.FromHours(24);

    public NavigationService(QAPlatformDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<List<NavNodeDto>> GetNavigationTreeAsync()
    {
        if (_cache.TryGetValue(CacheKey, out List<NavNodeDto>? cachedTree) && cachedTree != null)
        {
            return cachedTree;
        }

        var allNodes = await _context.NavNodes
            .AsNoTracking()
            .Where(n => n.IsActive)
            .OrderBy(n => n.Id)
            .ToListAsync();

        var nodeDtos = allNodes.Select(n => new NavNodeDto
        {
            Id = n.Id,
            Key = n.Key,
            ParentId = n.ParentId,
            NodeType = n.NodeType,
            Name = n.Name,
            Depth = n.Depth,
            IsActive = n.IsActive
        }).ToList();

        var rootNodes = nodeDtos.Where(n => n.ParentId == null).ToList();
        foreach (var root in rootNodes)
        {
            BuildTree(root, nodeDtos);
        }

        _cache.Set(CacheKey, rootNodes, CacheDuration);

        return rootNodes;
    }

    public async Task<NavNodeDto?> GetNodeByIdAsync(long id)
    {
        var node = await _context.NavNodes
            .AsNoTracking()
            .Where(n => n.Id == id && n.IsActive)
            .FirstOrDefaultAsync();

        if (node == null) return null;

        return new NavNodeDto
        {
            Id = node.Id,
            Key = node.Key,
            ParentId = node.ParentId,
            NodeType = node.NodeType,
            Name = node.Name,
            Depth = node.Depth,
            IsActive = node.IsActive
        };
    }

    public async Task<NavNodeDto?> GetNodeByKeyAsync(string nodeKey)
    {
        var cleanKey = nodeKey.Trim();
        var node = await _context.NavNodes
            .AsNoTracking()
            .Where(n => n.Key == cleanKey && n.IsActive)
            .FirstOrDefaultAsync();

        if (node == null) return null;

        return new NavNodeDto
        {
            Id = node.Id,
            Key = node.Key,
            ParentId = node.ParentId,
            NodeType = node.NodeType,
            Name = node.Name,
            Depth = node.Depth,
            IsActive = node.IsActive
        };
    }

    private void BuildTree(NavNodeDto parent, List<NavNodeDto> allNodes)
    {
        var children = allNodes
            .Where(n => n.ParentId == parent.Id)
            .OrderBy(n => n.Id)
            .ToList();

        parent.Children = children;

        foreach (var child in children)
        {
            BuildTree(child, allNodes);
        }
    }
}
