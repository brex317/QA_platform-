using QA_Platform.Domain.Common;
using QA_Platform.Domain.Enums;

namespace QA_Platform.Domain.Entities.HRMS;

/// <summary>
/// Represents a payroll execution instance
/// </summary>
public class PayrollRun : BaseAuditableEntity
{
    public string RunNumber { get; set; } = string.Empty;
    public long PeriodId { get; set; }
    public PayrollRunStatus Status { get; set; } = PayrollRunStatus.Draft;
    public int TotalEmployees { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal NetAmount { get; set; }
    public string Currency { get; set; } = "ETB";
    public DateTime? ProcessedDate { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public DateTime? ReversedDate { get; set; }

    // Navigation properties
    public PayrollPeriod Period { get; set; } = null!;
    public ICollection<PayrollJournal> PayrollJournals { get; set; } = new List<PayrollJournal>();
    public ICollection<Payslip> Payslips { get; set; } = new List<Payslip>();
}
