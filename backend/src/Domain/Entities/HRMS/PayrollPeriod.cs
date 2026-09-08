using QA_Platform.Domain.Common;
using QA_Platform.Domain.Enums;

namespace QA_Platform.Domain.Entities.HRMS;

/// <summary>
/// Represents a payroll processing period
/// </summary>
public class PayrollPeriod : BaseAuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public PayrollPeriodStatus Status { get; set; } = PayrollPeriodStatus.Open;

    // Navigation properties
    public ICollection<PayrollRun> PayrollRuns { get; set; } = new List<PayrollRun>();
}
