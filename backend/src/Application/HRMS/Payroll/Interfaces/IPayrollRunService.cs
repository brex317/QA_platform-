using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface IPayrollRunService
{
    Task<List<PayrollRunDto>> GetAllAsync(string? status = null);
    Task<PayrollRunDto?> GetByIdAsync(long id);
    Task<PayrollRunDto> CreateAsync(CreatePayrollRunDto dto);
    Task<PayrollRunDto> UpdateStatusAsync(UpdatePayrollRunStatusDto dto);
    Task<bool> ProcessPayrollAsync(long runId);
}
