namespace QA_Platform.Application.HRMS.Payroll.DTOs;

public class TaxScheduleDto
{
    public long Id { get; set; }
    public int OrderNo { get; set; }
    public decimal FromAmount { get; set; }
    public decimal? ToAmount { get; set; }
    public decimal RatePercent { get; set; }
    public decimal GovDeduction { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; }
}

public class CreateTaxScheduleDto
{
    public int OrderNo { get; set; }
    public decimal FromAmount { get; set; }
    public decimal? ToAmount { get; set; }
    public decimal RatePercent { get; set; }
    public decimal GovDeduction { get; set; }
    public DateTime EffectiveFrom { get; set; }
}

public class UpdateTaxScheduleDto
{
    public long Id { get; set; }
    public decimal RatePercent { get; set; }
    public decimal GovDeduction { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; }
}
