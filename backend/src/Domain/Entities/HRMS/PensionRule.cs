using QA_Platform.Domain.Common;

namespace QA_Platform.Domain.Entities.HRMS;

/// <summary>
/// Represents pension contribution rules by employment type
/// </summary>
public class PensionRule : BaseAuditableEntity
{
    public string EmploymentType { get; set; } = string.Empty;
    public decimal EmployeeRate { get; set; }
    public decimal EmployerRate { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
}
