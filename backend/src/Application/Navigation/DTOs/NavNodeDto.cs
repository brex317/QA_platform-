namespace QA_Platform.Application.Navigation.DTOs;

/// <summary>
/// DTO for navigation node matching the nav_nodes schema
/// </summary>
public class NavNodeDto
{
    public long Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string NodeKey { get => Key; set => Key = value; }
    public long? ParentId { get; set; }
    public string NodeType { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Depth { get; set; }
    public bool IsActive { get; set; }
    public List<NavNodeDto> Children { get; set; } = new List<NavNodeDto>();
}
