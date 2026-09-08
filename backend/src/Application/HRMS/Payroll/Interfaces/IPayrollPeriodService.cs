using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface IPayrollPeriodService
{
    Task<List<PayrollPeriodDto>> GetAllAsync(string? status = null);
    Task<PayrollPeriodDto?> GetByIdAsync(long id);
    Task<PayrollPeriodDto> CreateAsync(CreatePayrollPeriodDto dto);
    Task<PayrollPeriodDto> UpdateAsync(UpdatePayrollPeriodDto dto);
    Task<bool> DeleteAsync(long id);
}
