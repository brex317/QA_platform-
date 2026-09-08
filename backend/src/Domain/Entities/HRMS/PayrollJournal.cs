using QA_Platform.Domain.Common;
using QA_Platform.Domain.Enums;

namespace QA_Platform.Domain.Entities.HRMS;

/// <summary>
/// Represents an accounting journal entry for payroll
/// </summary>
public class PayrollJournal : BaseAuditableEntity
{
    public long RunId { get; set; }
    public string JournalNumber { get; set; } = string.Empty;
    public DateTime JournalDate { get; set; }
    public decimal DebitAmount { get; set; }
    public decimal CreditAmount { get; set; }
    public string Currency { get; set; } = "ETB";
    public JournalStatus Status { get; set; } = JournalStatus.Draft;
    public DateTime? PostedDate { get; set; }
    public DateTime? ReversedDate { get; set; }

    // Navigation properties
    public PayrollRun Run { get; set; } = null!;
}
