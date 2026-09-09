using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Domain.Entities.HRMS;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class PensionRuleService : IPensionRuleService
{
    private readonly QAPlatformDbContext _context;

    public PensionRuleService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<List<PensionRuleDto>> GetAllAsync()
    {
        return await _context.PensionRules
            .AsNoTracking()
            .Select(p => new PensionRuleDto
            {
                Id = p.Id,
                EmploymentType = p.EmploymentType,
                EmployeeRate = p.EmployeeRate,
                EmployerRate = p.EmployerRate,
                EffectiveFrom = p.EffectiveFrom,
                EffectiveTo = p.EffectiveTo,
                IsActive = p.IsActive
            }).ToListAsync();
    }

    public async Task<PensionRuleDto?> GetByIdAsync(long id)
    {
        var p = await _context.PensionRules.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return null;

        return new PensionRuleDto
        {
            Id = p.Id,
            EmploymentType = p.EmploymentType,
            EmployeeRate = p.EmployeeRate,
            EmployerRate = p.EmployerRate,
            EffectiveFrom = p.EffectiveFrom,
            EffectiveTo = p.EffectiveTo,
            IsActive = p.IsActive
        };
    }

    public async Task<PensionRuleDto?> GetByEmploymentTypeAsync(string employmentType)
    {
        var p = await _context.PensionRules
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.EmploymentType == employmentType && x.IsActive);

        if (p == null) return null;

        return new PensionRuleDto
        {
            Id = p.Id,
            EmploymentType = p.EmploymentType,
            EmployeeRate = p.EmployeeRate,
            EmployerRate = p.EmployerRate,
            EffectiveFrom = p.EffectiveFrom,
            EffectiveTo = p.EffectiveTo,
            IsActive = p.IsActive
        };
    }

    public async Task<PensionRuleDto> CreateAsync(CreatePensionRuleDto dto)
    {
        var entity = new PensionRule
        {
            EmploymentType = dto.EmploymentType,
            EmployeeRate = dto.EmployeeRate,
            EmployerRate = dto.EmployerRate,
            EffectiveFrom = dto.EffectiveFrom,
            IsActive = true
        };

        _context.PensionRules.Add(entity);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<PensionRuleDto> UpdateAsync(UpdatePensionRuleDto dto)
    {
        var entity = await _context.PensionRules.FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (entity == null) throw new KeyNotFoundException($"Pension rule {dto.Id} not found");

        entity.EmployeeRate = dto.EmployeeRate;
        entity.EmployerRate = dto.EmployerRate;
        entity.EffectiveTo = dto.EffectiveTo;
        entity.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.PensionRules.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return false;

        entity.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}
