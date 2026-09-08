namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class EmployeeAllowanceDto
{
    public long Id { get; set; }
    public long EmployeeId { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public long AllowanceTypeId { get; set; }
    public string AllowanceCode { get; set; } = string.Empty;
    public string AllowanceName { get; set; } = string.Empty;
    public string AllowanceType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; }
}

public class CreateEmployeeAllowanceDto
{
    public long EmployeeId { get; set; }
    public long AllowanceTypeId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "ETB";
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
}

public class UpdateEmployeeAllowanceDto
{
    public long Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; }
}
