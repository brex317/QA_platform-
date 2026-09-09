using QA_Platform.Application.Help.DTOs;

namespace QA_Platform.Application.Help.Interfaces;

public interface IHelpService
{
    Task<HelpResponseDto> GetHelpByNodeKeyAsync(string nodeKey);
}
