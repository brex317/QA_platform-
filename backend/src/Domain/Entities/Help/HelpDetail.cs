namespace QA_Platform.Domain.Entities.Help;

public class HelpDetail
{
    public long Id { get; set; }
    public long HelpHeaderId { get; set; }
    public HelpHeader? HelpHeader { get; set; }
    public int StepNumber { get; set; }
    public string StepText { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
