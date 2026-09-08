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
        // Try to get from cache first
        if (_cache.TryGetValue(CacheKey, out List<NavNodeDto>? cachedTree) && cachedTree != null)
        {
            return cachedTree;
        }

        // Load all nodes from database
        var allNodes = await _context.NavNodes
            .Where(n => n.IsActive)
            .OrderBy(n => n.DisplayOrder)
            .ToListAsync();

        // Build hierarchical structure
        var nodeDtos = allNodes.Select(n => new NavNodeDto
        {
            Id = n.Id,
            NodeKey = n.NodeKey,
            ParentId = n.ParentId,
            Title = n.Title,
            RouteUrl = n.RouteUrl,
            Icon = n.Icon,
            DisplayOrder = n.DisplayOrder,
            Depth = n.Depth,
            IsActive = n.IsActive
        }).ToList();

        // Build tree structure
        var rootNodes = nodeDtos.Where(n => n.ParentId == null).ToList();
        foreach (var root in rootNodes)
        {
            BuildTree(root, nodeDtos);
        }

        // Cache the result
        _cache.Set(CacheKey, rootNodes, CacheDuration);

        return rootNodes;
    }

    public async Task<NavNodeDto?> GetNodeByIdAsync(long id)
    {
        var node = await _context.NavNodes
            .Where(n => n.Id == id && n.IsActive)
            .FirstOrDefaultAsync();

        if (node == null) return null;

        return new NavNodeDto
        {
            Id = node.Id,
            NodeKey = node.NodeKey,
            ParentId = node.ParentId,
            Title = node.Title,
            RouteUrl = node.RouteUrl,
            Icon = node.Icon,
            DisplayOrder = node.DisplayOrder,
            Depth = node.Depth,
            IsActive = node.IsActive
        };
    }

    public async Task<NavNodeDto?> GetNodeByKeyAsync(string nodeKey)
    {
        var node = await _context.NavNodes
            .Where(n => n.NodeKey == nodeKey && n.IsActive)
            .FirstOrDefaultAsync();

        if (node == null) return null;

        return new NavNodeDto
        {
            Id = node.Id,
            NodeKey = node.NodeKey,
            ParentId = node.ParentId,
            Title = node.Title,
            RouteUrl = node.RouteUrl,
            Icon = node.Icon,
            DisplayOrder = node.DisplayOrder,
            Depth = node.Depth,
            IsActive = node.IsActive
        };
    }

    private void BuildTree(NavNodeDto parent, List<NavNodeDto> allNodes)
    {
        var children = allNodes
            .Where(n => n.ParentId == parent.Id)
            .OrderBy(n => n.DisplayOrder)
            .ToList();

        parent.Children = children;

        foreach (var child in children)
        {
            BuildTree(child, allNodes);
        }
    }
}
