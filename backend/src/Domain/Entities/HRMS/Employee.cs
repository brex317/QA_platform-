using QA_Platform.Domain.Common;
using QA_Platform.Domain.Enums;

namespace QA_Platform.Domain.Entities.HRMS;

/// <summary>
/// Represents an employee in the system
/// </summary>
public class Employee : BaseAuditableEntity
{
    public string EmployeeCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? JobTitle { get; set; }
    public string? Department { get; set; }
    public string EmploymentType { get; set; } = "Full Time";
    public DateTime? HireDate { get; set; }
    public EmployeeStatus Status { get; set; } = EmployeeStatus.ACTIVE;

    // Navigation properties
    public ICollection<EmployeeAllowance> EmployeeAllowances { get; set; } = new List<EmployeeAllowance>();
    public ICollection<Payslip> Payslips { get; set; } = new List<Payslip>();
}
