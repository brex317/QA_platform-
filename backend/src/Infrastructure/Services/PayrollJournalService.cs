using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Domain.Entities.HRMS;
using QA_Platform.Domain.Enums;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class PayrollJournalService : IPayrollJournalService
{
    private readonly QAPlatformDbContext _context;

    public PayrollJournalService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<List<PayrollJournalDto>> GetAllAsync(string? status = null, long? runId = null)
    {
        var query = _context.PayrollJournals
            .Include(pj => pj.Run)
            .AsNoTracking();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<JournalStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(pj => pj.Status == parsedStatus);
        }

        if (runId.HasValue)
        {
            query = query.Where(pj => pj.RunId == runId.Value);
        }

        return await query.Select(pj => new PayrollJournalDto
        {
            Id = pj.Id,
            RunId = pj.RunId,
            RunNumber = pj.Run != null ? pj.Run.RunNumber : string.Empty,
            JournalNumber = pj.JournalNumber,
            JournalDate = pj.JournalDate,
            DebitAmount = pj.DebitAmount,
            CreditAmount = pj.CreditAmount,
            Currency = pj.Currency,
            Status = pj.Status.ToString(),
            PostedDate = pj.PostedDate,
            CreatedAt = pj.CreatedAt
        }).ToListAsync();
    }

    public async Task<PayrollJournalDto?> GetByIdAsync(long id)
    {
        var pj = await _context.PayrollJournals
            .Include(x => x.Run)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (pj == null) return null;

        return new PayrollJournalDto
        {
            Id = pj.Id,
            RunId = pj.RunId,
            RunNumber = pj.Run != null ? pj.Run.RunNumber : string.Empty,
            JournalNumber = pj.JournalNumber,
            JournalDate = pj.JournalDate,
            DebitAmount = pj.DebitAmount,
            CreditAmount = pj.CreditAmount,
            Currency = pj.Currency,
            Status = pj.Status.ToString(),
            PostedDate = pj.PostedDate,
            CreatedAt = pj.CreatedAt
        };
    }

    public async Task<PayrollJournalDto> CreateAsync(CreatePayrollJournalDto dto)
    {
        var run = await _context.PayrollRuns.FirstOrDefaultAsync(r => r.Id == dto.RunId);
        if (run == null) throw new KeyNotFoundException($"Payroll run {dto.RunId} not found");

        var journalCount = await _context.PayrollJournals.CountAsync();
        var journalNumber = $"PJ-{(journalCount + 1):D6}";

        var entity = new PayrollJournal
        {
            RunId = dto.RunId,
            JournalNumber = journalNumber,
            JournalDate = dto.JournalDate,
            DebitAmount = run.GrossAmount,
            CreditAmount = run.GrossAmount,
            Currency = run.Currency,
            Status = JournalStatus.Draft,
            IsActive = true
        };

        _context.PayrollJournals.Add(entity);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<PayrollJournalDto> UpdateStatusAsync(UpdatePayrollJournalStatusDto dto)
    {
        var entity = await _context.PayrollJournals.FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (entity == null) throw new KeyNotFoundException($"Payroll journal {dto.Id} not found");

        if (Enum.TryParse<JournalStatus>(dto.Status, true, out var newStatus))
        {
            entity.Status = newStatus;
            if (newStatus == JournalStatus.Posted)
            {
                entity.PostedDate = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }
}
