using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface IEmployeeAllowanceService
{
    Task<List<EmployeeAllowanceDto>> GetAllAsync(string? type = null, bool? isActive = null);
    Task<List<EmployeeAllowanceDto>> GetByEmployeeIdAsync(long employeeId);
    Task<EmployeeAllowanceDto?> GetByIdAsync(long id);
    Task<EmployeeAllowanceDto> CreateAsync(CreateEmployeeAllowanceDto dto);
    Task<EmployeeAllowanceDto> UpdateAsync(UpdateEmployeeAllowanceDto dto);
    Task<bool> DeleteAsync(long id);
}
