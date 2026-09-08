namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class PayrollPeriodDto
{
    public long Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class CreatePayrollPeriodDto
{
    public string Code { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class UpdatePayrollPeriodDto
{
    public long Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
