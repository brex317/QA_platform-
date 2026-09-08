namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class PayrollJournalDto
{
    public long Id { get; set; }
    public long RunId { get; set; }
    public string RunNumber { get; set; } = string.Empty;
    public string JournalNumber { get; set; } = string.Empty;
    public DateTime JournalDate { get; set; }
    public decimal DebitAmount { get; set; }
    public decimal CreditAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? PostedDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePayrollJournalDto
{
    public long RunId { get; set; }
    public DateTime JournalDate { get; set; }
}

public class UpdatePayrollJournalStatusDto
{
    public long Id { get; set; }
    public string Status { get; set; } = string.Empty;
}
