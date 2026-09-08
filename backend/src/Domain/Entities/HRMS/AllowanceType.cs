using QA_Platform.Domain.Common;
using QA_Platform.Domain.Enums;

namespace QA_Platform.Domain.Entities.HRMS;

/// <summary>
/// Represents a type of allowance (earning or deduction)
/// </summary>
public class AllowanceType : BaseAuditableEntity
{
    public string SystemComponent { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public AllowanceTypeEnum Type { get; set; }
    public bool IsTaxable { get; set; }
    public bool IsPensionable { get; set; }
    public bool IsRecurring { get; set; } = true;
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }

    // Navigation properties
    public ICollection<EmployeeAllowance> EmployeeAllowances { get; set; } = new List<EmployeeAllowance>();
}
