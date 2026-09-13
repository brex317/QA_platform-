using QA_Platform.Domain.Common;
using QA_Platform.Domain.Entities.Help;

namespace QA_Platform.Domain.Entities.Navigation;

/// <summary>
/// Represents a navigation node matching the nav_nodes table
/// </summary>
public class NavNode : BaseAuditableEntity
{
    public string Key { get; set; } = string.Empty;
    public long? ParentId { get; set; }
    public string NodeType { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Depth { get; set; } = 1;

    // Navigation properties
    public NavNode? Parent { get; set; }
    public ICollection<NavNode> Children { get; set; } = new List<NavNode>();
    public ICollection<HelpHeader> HelpHeaders { get; set; } = new List<HelpHeader>();
}

