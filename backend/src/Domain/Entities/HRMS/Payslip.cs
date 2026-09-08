using QA_Platform.Domain.Common;

namespace QA_Platform.Domain.Entities.HRMS;

/// <summary>
/// Represents an individual employee payslip
/// </summary>
public class Payslip : BaseAuditableEntity
{
    public long PayrollRunId { get; set; }
    public long EmployeeId { get; set; }
    public decimal GrossPay { get; set; }
    public decimal TaxDeduction { get; set; }
    public decimal PensionDeduction { get; set; }
    public decimal OtherDeductions { get; set; }
    public decimal NetPay { get; set; }
    public string Currency { get; set; } = "ETB";

    // Navigation properties
    public PayrollRun PayrollRun { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}
