using QA_Platform.Domain.Common;

namespace QA_Platform.Domain.Entities.Navigation;

/// <summary>
/// Represents a navigation node in the hierarchical menu structure
/// </summary>
public class NavNode : BaseAuditableEntity
{
    public string NodeKey { get; set; } = string.Empty;
    public long? ParentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? RouteUrl { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public int Depth { get; set; } = 1;

    // Navigation properties
    public NavNode? Parent { get; set; }
    public ICollection<NavNode> Children { get; set; } = new List<NavNode>();
}
