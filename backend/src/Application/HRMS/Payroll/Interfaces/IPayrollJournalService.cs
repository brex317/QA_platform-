using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.Application.HRMS.Payroll.Interfaces;

public interface IPayrollJournalService
{
    Task<List<PayrollJournalDto>> GetAllAsync(string? status = null, long? runId = null);
    Task<PayrollJournalDto?> GetByIdAsync(long id);
    Task<PayrollJournalDto> CreateAsync(CreatePayrollJournalDto dto);
    Task<PayrollJournalDto> UpdateStatusAsync(UpdatePayrollJournalStatusDto dto);
}
