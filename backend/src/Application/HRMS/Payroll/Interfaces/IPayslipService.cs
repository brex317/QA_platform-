using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface IPayslipService
{
    Task<List<PayslipDto>> GetAllAsync(string? department = null);
    Task<List<PayslipDto>> GetByPayrollRunIdAsync(long payrollRunId);
    Task<PayslipDto?> GetByIdAsync(long id);
}
