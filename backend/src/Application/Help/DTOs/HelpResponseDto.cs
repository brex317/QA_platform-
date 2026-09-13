namespace QA_Platform.Application.Help.DTOs;

public class HelpStepDto
{
    public int StepNumber { get; set; }
    public string StepText { get; set; } = string.Empty;

    // Aliases for compatibility
    public int Number { get => StepNumber; set => StepNumber = value; }
    public string Text { get => StepText; set => StepText = value; }
}

public class HelpResponseDto
{
    public string NodeKey { get; set; } = string.Empty;
    public string ContextKey { get; set; } = "page";
    public List<HelpStepDto> Steps { get; set; } = new();
}
