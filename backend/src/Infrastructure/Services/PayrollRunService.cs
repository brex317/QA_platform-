using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Domain.Entities.HRMS;
using QA_Platform.Domain.Enums;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class PayrollRunService : IPayrollRunService
{
    private readonly QAPlatformDbContext _context;

    public PayrollRunService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<List<PayrollRunDto>> GetAllAsync(string? status = null)
    {
        var query = _context.PayrollRuns
            .Include(r => r.Period)
            .AsNoTracking();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<PayrollRunStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(r => r.Status == parsedStatus);
        }

        return await query.Select(r => new PayrollRunDto
        {
            Id = r.Id,
            RunNumber = r.RunNumber,
            PeriodId = r.PeriodId,
            PeriodCode = r.Period != null ? r.Period.Code : string.Empty,
            Status = r.Status.ToString(),
            TotalEmployees = r.TotalEmployees,
            GrossAmount = r.GrossAmount,
            NetAmount = r.NetAmount,
            Currency = r.Currency,
            ProcessedDate = r.ProcessedDate,
            ApprovedDate = r.ApprovedDate,
            PaidDate = r.PaidDate,
            CreatedAt = r.CreatedAt
        }).ToListAsync();
    }

    public async Task<PayrollRunDto?> GetByIdAsync(long id)
    {
        var r = await _context.PayrollRuns
            .Include(x => x.Period)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (r == null) return null;

        return new PayrollRunDto
        {
            Id = r.Id,
            RunNumber = r.RunNumber,
            PeriodId = r.PeriodId,
            PeriodCode = r.Period != null ? r.Period.Code : string.Empty,
            Status = r.Status.ToString(),
            TotalEmployees = r.TotalEmployees,
            GrossAmount = r.GrossAmount,
            NetAmount = r.NetAmount,
            Currency = r.Currency,
            ProcessedDate = r.ProcessedDate,
            ApprovedDate = r.ApprovedDate,
            PaidDate = r.PaidDate,
            CreatedAt = r.CreatedAt
        };
    }

    public async Task<PayrollRunDto> CreateAsync(CreatePayrollRunDto dto)
    {
        var period = await _context.PayrollPeriods.FirstOrDefaultAsync(p => p.Id == dto.PeriodId);
        if (period == null) throw new KeyNotFoundException($"Payroll period {dto.PeriodId} not found");

        var runCount = await _context.PayrollRuns.CountAsync();
        var runNumber = $"PR-{(runCount + 1):D6}";

        var entity = new PayrollRun
        {
            RunNumber = runNumber,
            PeriodId = dto.PeriodId,
            Status = PayrollRunStatus.Draft,
            TotalEmployees = 0,
            GrossAmount = 0,
            NetAmount = 0,
            Currency = "ETB",
            IsActive = true
        };

        _context.PayrollRuns.Add(entity);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<PayrollRunDto> UpdateStatusAsync(UpdatePayrollRunStatusDto dto)
    {
        var entity = await _context.PayrollRuns.FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (entity == null) throw new KeyNotFoundException($"Payroll run {dto.Id} not found");

        if (Enum.TryParse<PayrollRunStatus>(dto.Status, true, out var newStatus))
        {
            entity.Status = newStatus;
            if (newStatus == PayrollRunStatus.Approved)
            {
                entity.ApprovedDate = DateTime.UtcNow;
            }
            else if (newStatus == PayrollRunStatus.Paid)
            {
                entity.PaidDate = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<bool> ProcessPayrollAsync(long runId)
    {
        var run = await _context.PayrollRuns.FirstOrDefaultAsync(r => r.Id == runId);
        if (run == null) return false;

        run.Status = PayrollRunStatus.Approved;
        run.ProcessedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}
