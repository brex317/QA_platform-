using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface IPayrollDashboardService
{
    Task<PayrollDashboardDto> GetDashboardSummaryAsync();
}
