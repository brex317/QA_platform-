using QA_Platform.Domain.Common;

namespace QA_Platform.Domain.Entities.HRMS;

/// <summary>
/// Represents a progressive tax bracket
/// </summary>
public class TaxSchedule : BaseAuditableEntity
{
    public int OrderNo { get; set; }
    public decimal FromAmount { get; set; }
    public decimal? ToAmount { get; set; }
    public decimal RatePercent { get; set; }
    public decimal GovDeduction { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
}
