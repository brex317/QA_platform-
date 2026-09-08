namespace QA_Platform.Application.Navigation.DTOs;

/// <summary>
/// DTO for navigation node with recursive children
/// </summary>
public class NavNodeDto
{
    public long Id { get; set; }
    public string NodeKey { get; set; } = string.Empty;
    public long? ParentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? RouteUrl { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public int Depth { get; set; }
    public bool IsActive { get; set; }
    public List<NavNodeDto> Children { get; set; } = new List<NavNodeDto>();
}
