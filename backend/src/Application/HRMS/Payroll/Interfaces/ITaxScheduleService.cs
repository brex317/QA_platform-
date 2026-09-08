using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface ITaxScheduleService
{
    Task<List<TaxScheduleDto>> GetAllAsync();
    Task<List<TaxScheduleDto>> GetActiveSchedulesAsync();
    Task<TaxScheduleDto?> GetByIdAsync(long id);
    Task<TaxScheduleDto> CreateAsync(CreateTaxScheduleDto dto);
    Task<TaxScheduleDto> UpdateAsync(UpdateTaxScheduleDto dto);
    Task<bool> DeleteAsync(long id);
}
