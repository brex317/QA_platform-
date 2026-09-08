namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class AllowanceTypeDto
{
    public long Id { get; set; }
    public string SystemComponent { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsTaxable { get; set; }
    public bool IsPensionable { get; set; }
    public bool IsRecurring { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; }
}

public class CreateAllowanceTypeDto
{
    public string SystemComponent { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsTaxable { get; set; }
    public bool IsPensionable { get; set; }
    public bool IsRecurring { get; set; } = true;
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
}

public class UpdateAllowanceTypeDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsTaxable { get; set; }
    public bool IsPensionable { get; set; }
    public bool IsRecurring { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; }
}
