using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Domain.Entities.HRMS;
using QA_Platform.Domain.Enums;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class AllowanceTypeService : IAllowanceTypeService
{
    private readonly QAPlatformDbContext _context;

    public AllowanceTypeService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<List<AllowanceTypeDto>> GetAllAsync(string? type = null, bool? isActive = null)
    {
        var query = _context.AllowanceTypes.AsNoTracking();

        if (!string.IsNullOrEmpty(type) && Enum.TryParse<AllowanceTypeEnum>(type, true, out var parsedType))
        {
            query = query.Where(a => a.Type == parsedType);
        }

        if (isActive.HasValue)
        {
            query = query.Where(a => a.IsActive == isActive.Value);
        }

        return await query.Select(a => new AllowanceTypeDto
        {
            Id = a.Id,
            SystemComponent = a.SystemComponent,
            Code = a.Code,
            Name = a.Name,
            Type = a.Type.ToString(),
            IsTaxable = a.IsTaxable,
            IsPensionable = a.IsPensionable,
            IsRecurring = a.IsRecurring,
            EffectiveFrom = a.EffectiveFrom,
            EffectiveTo = a.EffectiveTo,
            IsActive = a.IsActive
        }).ToListAsync();
    }

    public async Task<AllowanceTypeDto?> GetByIdAsync(long id)
    {
        var a = await _context.AllowanceTypes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (a == null) return null;

        return new AllowanceTypeDto
        {
            Id = a.Id,
            SystemComponent = a.SystemComponent,
            Code = a.Code,
            Name = a.Name,
            Type = a.Type.ToString(),
            IsTaxable = a.IsTaxable,
            IsPensionable = a.IsPensionable,
            IsRecurring = a.IsRecurring,
            EffectiveFrom = a.EffectiveFrom,
            EffectiveTo = a.EffectiveTo,
            IsActive = a.IsActive
        };
    }

    public async Task<AllowanceTypeDto> CreateAsync(CreateAllowanceTypeDto dto)
    {
        Enum.TryParse<AllowanceTypeEnum>(dto.Type, true, out var typeEnum);

        var entity = new AllowanceType
        {
            SystemComponent = dto.SystemComponent,
            Code = dto.Code,
            Name = dto.Name,
            Type = typeEnum,
            IsTaxable = dto.IsTaxable,
            IsPensionable = dto.IsPensionable,
            IsRecurring = dto.IsRecurring,
            EffectiveFrom = dto.EffectiveFrom,
            EffectiveTo = dto.EffectiveTo,
            IsActive = true
        };

        _context.AllowanceTypes.Add(entity);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<AllowanceTypeDto> UpdateAsync(UpdateAllowanceTypeDto dto)
    {
        var entity = await _context.AllowanceTypes.FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (entity == null) throw new KeyNotFoundException($"Allowance type {dto.Id} not found");

        entity.Name = dto.Name;
        entity.IsTaxable = dto.IsTaxable;
        entity.IsPensionable = dto.IsPensionable;
        entity.IsRecurring = dto.IsRecurring;
        entity.EffectiveTo = dto.EffectiveTo;
        entity.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.AllowanceTypes.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return false;

        entity.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}
