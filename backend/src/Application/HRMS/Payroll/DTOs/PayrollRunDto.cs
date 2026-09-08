namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class PayrollRunDto
{
    public long Id { get; set; }
    public string RunNumber { get; set; } = string.Empty;
    public long PeriodId { get; set; }
    public string PeriodCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int TotalEmployees { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal NetAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime? ProcessedDate { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePayrollRunDto
{
    public long PeriodId { get; set; }
}

public class UpdatePayrollRunStatusDto
{
    public long Id { get; set; }
    public string Status { get; set; } = string.Empty;
}
