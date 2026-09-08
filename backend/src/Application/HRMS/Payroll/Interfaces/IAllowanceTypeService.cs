using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface IAllowanceTypeService
{
    Task<List<AllowanceTypeDto>> GetAllAsync(string? type = null, bool? isActive = null);
    Task<AllowanceTypeDto?> GetByIdAsync(long id);
    Task<AllowanceTypeDto> CreateAsync(CreateAllowanceTypeDto dto);
    Task<AllowanceTypeDto> UpdateAsync(UpdateAllowanceTypeDto dto);
    Task<bool> DeleteAsync(long id);
}
