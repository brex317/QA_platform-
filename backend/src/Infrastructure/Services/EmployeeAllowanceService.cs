using Microsoft.EntityFrameworkCore;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Domain.Entities.HRMS;
using QA_Platform.Infrastructure.Data;

namespace QA_Platform.Infrastructure.Services;

public class EmployeeAllowanceService : IEmployeeAllowanceService
{
    private readonly QAPlatformDbContext _context;

    public EmployeeAllowanceService(QAPlatformDbContext context)
    {
        _context = context;
    }

    public async Task<List<EmployeeAllowanceDto>> GetAllAsync(string? type = null, bool? isActive = null)
    {
        var query = _context.EmployeeAllowances
            .Include(ea => ea.Employee)
            .Include(ea => ea.AllowanceType)
            .AsNoTracking();

        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(ea => ea.AllowanceType.Type.ToString() == type);
        }

        if (isActive.HasValue)
        {
            query = query.Where(ea => ea.IsActive == isActive.Value);
        }

        return await query.Select(ea => new EmployeeAllowanceDto
        {
            Id = ea.Id,
            EmployeeId = ea.EmployeeId,
            EmployeeCode = ea.Employee.EmployeeCode,
            EmployeeName = ea.Employee.FullName,
            AllowanceTypeId = ea.AllowanceTypeId,
            AllowanceCode = ea.AllowanceType.Code,
            AllowanceName = ea.AllowanceType.Name,
            AllowanceType = ea.AllowanceType.Type.ToString(),
            Amount = ea.Amount,
            Currency = ea.Currency,
            EffectiveFrom = ea.EffectiveFrom,
            EffectiveTo = ea.EffectiveTo,
            IsActive = ea.IsActive
        }).ToListAsync();
    }

    public async Task<List<EmployeeAllowanceDto>> GetByEmployeeIdAsync(long employeeId)
    {
        return await _context.EmployeeAllowances
            .Include(ea => ea.Employee)
            .Include(ea => ea.AllowanceType)
            .AsNoTracking()
            .Where(ea => ea.EmployeeId == employeeId)
            .Select(ea => new EmployeeAllowanceDto
            {
                Id = ea.Id,
                EmployeeId = ea.EmployeeId,
                EmployeeCode = ea.Employee.EmployeeCode,
                EmployeeName = ea.Employee.FullName,
                AllowanceTypeId = ea.AllowanceTypeId,
                AllowanceCode = ea.AllowanceType.Code,
                AllowanceName = ea.AllowanceType.Name,
                AllowanceType = ea.AllowanceType.Type.ToString(),
                Amount = ea.Amount,
                Currency = ea.Currency,
                EffectiveFrom = ea.EffectiveFrom,
                EffectiveTo = ea.EffectiveTo,
                IsActive = ea.IsActive
            }).ToListAsync();
    }

    public async Task<EmployeeAllowanceDto?> GetByIdAsync(long id)
    {
        var ea = await _context.EmployeeAllowances
            .Include(x => x.Employee)
            .Include(x => x.AllowanceType)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (ea == null) return null;

        return new EmployeeAllowanceDto
        {
            Id = ea.Id,
            EmployeeId = ea.EmployeeId,
            EmployeeCode = ea.Employee.EmployeeCode,
            EmployeeName = ea.Employee.FullName,
            AllowanceTypeId = ea.AllowanceTypeId,
            AllowanceCode = ea.AllowanceType.Code,
            AllowanceName = ea.AllowanceType.Name,
            AllowanceType = ea.AllowanceType.Type.ToString(),
            Amount = ea.Amount,
            Currency = ea.Currency,
            EffectiveFrom = ea.EffectiveFrom,
            EffectiveTo = ea.EffectiveTo,
            IsActive = ea.IsActive
        };
    }

    public async Task<EmployeeAllowanceDto> CreateAsync(CreateEmployeeAllowanceDto dto)
    {
        var entity = new EmployeeAllowance
        {
            EmployeeId = dto.EmployeeId,
            AllowanceTypeId = dto.AllowanceTypeId,
            Amount = dto.Amount,
            Currency = dto.Currency,
            EffectiveFrom = dto.EffectiveFrom,
            EffectiveTo = dto.EffectiveTo,
            IsActive = true
        };

        _context.EmployeeAllowances.Add(entity);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<EmployeeAllowanceDto> UpdateAsync(UpdateEmployeeAllowanceDto dto)
    {
        var entity = await _context.EmployeeAllowances.FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (entity == null) throw new KeyNotFoundException($"Employee allowance {dto.Id} not found");

        entity.Amount = dto.Amount;
        entity.EffectiveTo = dto.EffectiveTo;
        entity.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(entity.Id))!;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.EmployeeAllowances.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return false;

        entity.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}
