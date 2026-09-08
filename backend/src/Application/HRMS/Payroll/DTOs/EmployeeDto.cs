namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class EmployeeDto
{
    public long Id { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? JobTitle { get; set; }
    public string? Department { get; set; }
    public string EmploymentType { get; set; } = string.Empty;
    public DateTime? HireDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
