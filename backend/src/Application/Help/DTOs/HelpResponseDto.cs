namespace QA_Platform.Application.Help.DTOs;

public class HelpStepDto
{
    public int Number { get; set; }
    public string Text { get; set; } = string.Empty;
}

public class HelpResponseDto
{
    public string NodeKey { get; set; } = string.Empty;
    public string Title { get; set; } = "Quick steps";
    public List<HelpStepDto> Steps { get; set; } = new();
}
