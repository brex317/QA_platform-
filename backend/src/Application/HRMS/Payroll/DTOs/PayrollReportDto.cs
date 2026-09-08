namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class PayrollReportDto
{
    public string EmployeeCode { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public decimal GrossPay { get; set; }
    public decimal TaxDeduction { get; set; }
    public decimal PensionDeduction { get; set; }
    public decimal NetPay { get; set; }
}
