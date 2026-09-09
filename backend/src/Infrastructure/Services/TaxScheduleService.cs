using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Domain.Entities.HRMS;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class TaxScheduleService : ITaxScheduleService
{
    private readonly QAPlatformDbContext _context;

    public TaxScheduleService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaxScheduleDto>> GetAllAsync()
    {
        return await _context.TaxSchedules
            .AsNoTracking()
            .OrderBy(t => t.OrderNo)
            .Select(t => new TaxScheduleDto
            {
                Id = t.Id,
                OrderNo = t.OrderNo,
                FromAmount = t.FromAmount,
                ToAmount = t.ToAmount,
                RatePercent = t.RatePercent,
                GovDeduction = t.GovDeduction,
                EffectiveFrom = t.EffectiveFrom,
                EffectiveTo = t.EffectiveTo,
                IsActive = t.IsActive
            }).ToListAsync();
    }

    public async Task<List<TaxScheduleDto>> GetActiveSchedulesAsync()
    {
        return await _context.TaxSchedules
            .AsNoTracking()
            .Where(t => t.IsActive)
            .OrderBy(t => t.OrderNo)
            .Select(t => new TaxScheduleDto
            {
                Id = t.Id,
                OrderNo = t.OrderNo,
                FromAmount = t.FromAmount,
                ToAmount = t.ToAmount,
                RatePercent = t.RatePercent,
                GovDeduction = t.GovDeduction,
                EffectiveFrom = t.EffectiveFrom,
                EffectiveTo = t.EffectiveTo,
                IsActive = t.IsActive
            }).ToListAsync();
    }

    public async Task<TaxScheduleDto?> GetByIdAsync(long id)
    {
        var t = await _context.TaxSchedules.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (t == null) return null;

        return new TaxScheduleDto
        {
            Id = t.Id,
            OrderNo = t.OrderNo,
            FromAmount = t.FromAmount,
            ToAmount = t.ToAmount,
            RatePercent = t.RatePercent,
            GovDeduction = t.GovDeduction,
            EffectiveFrom = t.EffectiveFrom,
            EffectiveTo = t.EffectiveTo,
            IsActive = t.IsActive
        };
    }

    public async Task<TaxScheduleDto> CreateAsync(CreateTaxScheduleDto dto)
    {
        var entity = new TaxSchedule
        {
            OrderNo = dto.OrderNo,
            FromAmount = dto.FromAmount,
            ToAmount = dto.ToAmount,
            RatePercent = dto.RatePercent,
            GovDeduction = dto.GovDeduction,
            EffectiveFrom = dto.EffectiveFrom,
            IsActive = true
        };

        _context.TaxSchedules.Add(entity);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<TaxScheduleDto> UpdateAsync(UpdateTaxScheduleDto dto)
    {
        var entity = await _context.TaxSchedules.FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (entity == null) throw new KeyNotFoundException($"Tax schedule {dto.Id} not found");

        entity.RatePercent = dto.RatePercent;
        entity.GovDeduction = dto.GovDeduction;
        entity.EffectiveTo = dto.EffectiveTo;
        entity.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.TaxSchedules.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return false;

        entity.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}
