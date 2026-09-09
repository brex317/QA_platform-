using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class PayrollReportService : IPayrollReportService
{
    private readonly QAPlatformDbContext _context;

    public PayrollReportService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<List<PayrollReportDto>> GetPayrollRegisterAsync(long? periodId = null)
    {
        var query = _context.Payslips
            .Include(p => p.Employee)
            .Include(p => p.PayrollRun)
            .AsNoTracking();

        if (periodId.HasValue)
        {
            query = query.Where(p => p.PayrollRun.PeriodId == periodId.Value);
        }

        return await query.Select(p => new PayrollReportDto
        {
            EmployeeCode = p.Employee.EmployeeCode,
            EmployeeName = p.Employee.FullName,
            Department = p.Employee.Department ?? "N/A",
            GrossPay = p.GrossPay,
            TaxDeduction = p.TaxDeduction,
            PensionDeduction = p.PensionDeduction,
            NetPay = p.NetPay
        }).ToListAsync();
    }

    public async Task<List<PayrollReportDto>> GetTaxReportAsync(long? periodId = null)
    {
        var query = _context.Payslips
            .Include(p => p.Employee)
            .Include(p => p.PayrollRun)
            .AsNoTracking();

        if (periodId.HasValue)
        {
            query = query.Where(p => p.PayrollRun.PeriodId == periodId.Value);
        }

        return await query.Select(p => new PayrollReportDto
        {
            EmployeeCode = p.Employee.EmployeeCode,
            EmployeeName = p.Employee.FullName,
            Department = p.Employee.Department ?? "N/A",
            GrossPay = p.GrossPay,
            TaxDeduction = p.TaxDeduction,
            PensionDeduction = p.PensionDeduction,
            NetPay = p.NetPay
        }).ToListAsync();
    }

    public async Task<List<PayrollReportDto>> GetPensionReportAsync(long? periodId = null)
    {
        var query = _context.Payslips
            .Include(p => p.Employee)
            .Include(p => p.PayrollRun)
            .AsNoTracking();

        if (periodId.HasValue)
        {
            query = query.Where(p => p.PayrollRun.PeriodId == periodId.Value);
        }

        return await query.Select(p => new PayrollReportDto
        {
            EmployeeCode = p.Employee.EmployeeCode,
            EmployeeName = p.Employee.FullName,
            Department = p.Employee.Department ?? "N/A",
            GrossPay = p.GrossPay,
            TaxDeduction = p.TaxDeduction,
            PensionDeduction = p.PensionDeduction,
            NetPay = p.NetPay
        }).ToListAsync();
    }

    public async Task<List<PayrollReportDto>> GetDepartmentReportAsync(long? periodId = null)
    {
        var query = _context.Payslips
            .Include(p => p.Employee)
            .Include(p => p.PayrollRun)
            .AsNoTracking();

        if (periodId.HasValue)
        {
            query = query.Where(p => p.PayrollRun.PeriodId == periodId.Value);
        }

        return await query.Select(p => new PayrollReportDto
        {
            EmployeeCode = p.Employee.EmployeeCode,
            EmployeeName = p.Employee.FullName,
            Department = p.Employee.Department ?? "N/A",
            GrossPay = p.GrossPay,
            TaxDeduction = p.TaxDeduction,
            PensionDeduction = p.PensionDeduction,
            NetPay = p.NetPay
        }).ToListAsync();
    }
}
