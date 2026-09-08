namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class PayrollDashboardDto
{
    public int TotalEmployees { get; set; }
    public string ActivePeriod { get; set; } = string.Empty;
    public int TotalPayrollRuns { get; set; }
    public decimal TotalGrossPay { get; set; }
    public decimal TotalNetPay { get; set; }
    public string Currency { get; set; } = "ETB";
}
