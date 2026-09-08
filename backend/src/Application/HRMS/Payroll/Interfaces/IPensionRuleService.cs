using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface IPensionRuleService
{
    Task<List<PensionRuleDto>> GetAllAsync();
    Task<PensionRuleDto?> GetByIdAsync(long id);
    Task<PensionRuleDto?> GetByEmploymentTypeAsync(string employmentType);
    Task<PensionRuleDto> CreateAsync(CreatePensionRuleDto dto);
    Task<PensionRuleDto> UpdateAsync(UpdatePensionRuleDto dto);
    Task<bool> DeleteAsync(long id);
}
