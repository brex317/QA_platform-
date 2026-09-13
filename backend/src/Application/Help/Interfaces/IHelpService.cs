using QA_Platform.Application.Help.DTOs;

namespace QA_Platform.Application.Help.Interfaces;

public interface IHelpService
{
    Task<HelpResponseDto?> GetPageHelpAsync(string nodeKey);
    Task<HelpResponseDto?> GetFormHelpAsync(string nodeKey, string formContext = "add_form");
    Task<HelpResponseDto?> GetHelpByNodeKeyAsync(string nodeKey);
}
