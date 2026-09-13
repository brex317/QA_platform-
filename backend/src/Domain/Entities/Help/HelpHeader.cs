using QA_Platform.Domain.Entities.Navigation;

namespace QA_Platform.Domain.Entities.Help;

public class HelpHeader
{
    public long Id { get; set; }
    public long NodeId { get; set; }
    public NavNode? Node { get; set; }
    public string ContextKey { get; set; } = "page";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }

    public ICollection<HelpStep> Steps { get; set; } = new List<HelpStep>();
}

