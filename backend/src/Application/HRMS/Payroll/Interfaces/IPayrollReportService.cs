using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface IPayrollReportService
{
    Task<List<PayrollReportDto>> GetPayrollRegisterAsync(long? periodId = null);
    Task<List<PayrollReportDto>> GetTaxReportAsync(long? periodId = null);
    Task<List<PayrollReportDto>> GetPensionReportAsync(long? periodId = null);
    Task<List<PayrollReportDto>> GetDepartmentReportAsync(long? periodId = null);
}
