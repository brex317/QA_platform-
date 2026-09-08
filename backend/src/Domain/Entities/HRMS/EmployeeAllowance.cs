using QA_Platform.Domain.Common;

namespace QA_Platform.Domain.Entities.HRMS;

/// <summary>
/// Represents an allowance assigned to a specific employee
/// </summary>
public class EmployeeAllowance : BaseAuditableEntity
{
    public long EmployeeId { get; set; }
    public long AllowanceTypeId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "ETB";
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }

    // Navigation properties
    public Employee Employee { get; set; } = null!;
    public AllowanceType AllowanceType { get; set; } = null!;
}
