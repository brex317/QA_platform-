namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class PensionRuleDto
{
    public long Id { get; set; }
    public string EmploymentType { get; set; } = string.Empty;
    public decimal EmployeeRate { get; set; }
    public decimal EmployerRate { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; }
}

public class CreatePensionRuleDto
{
    public string EmploymentType { get; set; } = string.Empty;
    public decimal EmployeeRate { get; set; }
    public decimal EmployerRate { get; set; }
    public DateTime EffectiveFrom { get; set; }
}

public class UpdatePensionRuleDto
{
    public long Id { get; set; }
    public decimal EmployeeRate { get; set; }
    public decimal EmployerRate { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; }
}
