using QA_Platform.Application.Navigation.DTOs;

namespace QA_Platform.Application.Navigation.Interfaces;

/// <summary>
/// Service interface for navigation operations
/// </summary>
public interface INavigationService
{
    Task<List<NavNodeDto>> GetNavigationTreeAsync();
    Task<NavNodeDto?> GetNodeByIdAsync(long id);
    Task<NavNodeDto?> GetNodeByKeyAsync(string nodeKey);
}
