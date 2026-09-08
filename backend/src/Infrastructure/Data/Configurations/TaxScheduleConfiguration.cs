using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QA_Platform.Domain.Entities.HRMS;

namespace QA_Platform.Infrastructure.Data.Configurations;

public class TaxScheduleConfiguration : IEntityTypeConfiguration<TaxSchedule>
{
    public void Configure(EntityTypeBuilder<TaxSchedule> builder)
    {
        builder.ToTable("tax_schedules");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.OrderNo).HasColumnName("order_no");
        builder.Property(x => x.FromAmount).HasColumnName("from_amount").HasColumnType("decimal(15,2)");
        builder.Property(x => x.ToAmount).HasColumnName("to_amount").HasColumnType("decimal(15,2)");
        builder.Property(x => x.RatePercent).HasColumnName("rate_percent").HasColumnType("decimal(5,2)");
        builder.Property(x => x.GovDeduction).HasColumnName("gov_deduction").HasColumnType("decimal(15,2)");
        builder.Property(x => x.EffectiveFrom).HasColumnName("effective_from");
        builder.Property(x => x.EffectiveTo).HasColumnName("effective_to");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by").HasMaxLength(100);
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by").HasMaxLength(100);

        // Indexes
        builder.HasIndex(x => x.OrderNo);
        builder.HasIndex(x => x.IsActive);
    }
}
