using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Domain.Entities.HRMS;
using QA_Platform.Domain.Enums;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class PayrollPeriodService : IPayrollPeriodService
{
    private readonly QAPlatformDbContext _context;

    public PayrollPeriodService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<List<PayrollPeriodDto>> GetAllAsync(string? status = null)
    {
        var query = _context.PayrollPeriods.AsNoTracking();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<PayrollPeriodStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(p => p.Status == parsedStatus);
        }

        return await query.Select(p => new PayrollPeriodDto
        {
            Id = p.Id,
            Code = p.Code,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Status = p.Status.ToString(),
            IsActive = p.IsActive
        }).ToListAsync();
    }

    public async Task<PayrollPeriodDto?> GetByIdAsync(long id)
    {
        var p = await _context.PayrollPeriods.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return null;

        return new PayrollPeriodDto
        {
            Id = p.Id,
            Code = p.Code,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Status = p.Status.ToString(),
            IsActive = p.IsActive
        };
    }

    public async Task<PayrollPeriodDto> CreateAsync(CreatePayrollPeriodDto dto)
    {
        var entity = new PayrollPeriod
        {
            Code = dto.Code,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = PayrollPeriodStatus.Open,
            IsActive = true
        };

        _context.PayrollPeriods.Add(entity);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<PayrollPeriodDto> UpdateAsync(UpdatePayrollPeriodDto dto)
    {
        var entity = await _context.PayrollPeriods.FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (entity == null) throw new KeyNotFoundException($"Payroll period {dto.Id} not found");

        if (Enum.TryParse<PayrollPeriodStatus>(dto.Status, true, out var newStatus))
        {
            entity.Status = newStatus;
        }

        entity.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.PayrollPeriods.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return false;

        entity.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}
