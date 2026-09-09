using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class PayslipService : IPayslipService
{
    private readonly QAPlatformDbContext _context;

    public PayslipService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<List<PayslipDto>> GetAllAsync(string? department = null)
    {
        var query = _context.Payslips
            .Include(p => p.Employee)
            .AsNoTracking();

        if (!string.IsNullOrEmpty(department))
        {
            query = query.Where(p => p.Employee.Department == department);
        }

        return await query.Select(p => new PayslipDto
        {
            Id = p.Id,
            PayrollRunId = p.PayrollRunId,
            EmployeeId = p.EmployeeId,
            EmployeeCode = p.Employee.EmployeeCode,
            EmployeeName = p.Employee.FullName,
            Department = p.Employee.Department ?? "N/A",
            GrossPay = p.GrossPay,
            TaxDeduction = p.TaxDeduction,
            PensionDeduction = p.PensionDeduction,
            OtherDeductions = p.OtherDeductions,
            NetPay = p.NetPay,
            Currency = p.Currency
        }).ToListAsync();
    }

    public async Task<List<PayslipDto>> GetByPayrollRunIdAsync(long payrollRunId)
    {
        return await _context.Payslips
            .Include(p => p.Employee)
            .AsNoTracking()
            .Where(p => p.PayrollRunId == payrollRunId)
            .Select(p => new PayslipDto
            {
                Id = p.Id,
                PayrollRunId = p.PayrollRunId,
                EmployeeId = p.EmployeeId,
                EmployeeCode = p.Employee.EmployeeCode,
                EmployeeName = p.Employee.FullName,
                Department = p.Employee.Department ?? "N/A",
                GrossPay = p.GrossPay,
                TaxDeduction = p.TaxDeduction,
                PensionDeduction = p.PensionDeduction,
                OtherDeductions = p.OtherDeductions,
                NetPay = p.NetPay,
                Currency = p.Currency
            }).ToListAsync();
    }

    public async Task<PayslipDto?> GetByIdAsync(long id)
    {
        var p = await _context.Payslips
            .Include(x => x.Employee)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (p == null) return null;

        return new PayslipDto
        {
            Id = p.Id,
            PayrollRunId = p.PayrollRunId,
            EmployeeId = p.EmployeeId,
            EmployeeCode = p.Employee.EmployeeCode,
            EmployeeName = p.Employee.FullName,
            Department = p.Employee.Department ?? "N/A",
            GrossPay = p.GrossPay,
            TaxDeduction = p.TaxDeduction,
            PensionDeduction = p.PensionDeduction,
            OtherDeductions = p.OtherDeductions,
            NetPay = p.NetPay,
            Currency = p.Currency
        };
    }
}
