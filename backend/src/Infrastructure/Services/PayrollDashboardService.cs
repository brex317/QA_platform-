using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Domain.Enums;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class PayrollDashboardService : IPayrollDashboardService
{
    private readonly QAPlatformDbContext _context;

    public PayrollDashboardService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<PayrollDashboardDto> GetDashboardSummaryAsync()
    {
        var totalEmployees = await _context.Employees.CountAsync(e => e.IsActive && e.Status == EmployeeStatus.ACTIVE);

        var activePeriodObj = await _context.PayrollPeriods
            .Where(p => p.IsActive && p.Status == PayrollPeriodStatus.Open)
            .OrderByDescending(p => p.StartDate)
            .FirstOrDefaultAsync();

        var activePeriod = activePeriodObj?.Code ?? "N/A";

        var totalPayrollRuns = await _context.PayrollRuns.CountAsync(r => r.IsActive);

        var totalGrossPay = await _context.PayrollRuns
            .Where(r => r.IsActive)
            .SumAsync(r => r.GrossAmount);

        var totalNetPay = await _context.PayrollRuns
            .Where(r => r.IsActive)
            .SumAsync(r => r.NetAmount);

        return new PayrollDashboardDto
        {
            TotalEmployees = totalEmployees,
            ActivePeriod = activePeriod,
            TotalPayrollRuns = totalPayrollRuns,
            TotalGrossPay = totalGrossPay,
            TotalNetPay = totalNetPay,
            Currency = "ETB"
        };
    }
}
