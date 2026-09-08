using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QA_Platform.Domain.Entities.HRMS;

namespace QA_Platform.Infrastructure.Data.Configurations;

public class PayrollRunConfiguration : IEntityTypeConfiguration<PayrollRun>
{
    public void Configure(EntityTypeBuilder<PayrollRun> builder)
    {
        builder.ToTable("payroll_runs");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.RunNumber).HasColumnName("run_number").HasMaxLength(50).IsRequired();
        builder.Property(x => x.PeriodId).HasColumnName("period_id");
        builder.Property(x => x.Status).HasColumnName("status").HasMaxLength(20)
            .HasConversion<string>();
        builder.Property(x => x.TotalEmployees).HasColumnName("total_employees");
        builder.Property(x => x.GrossAmount).HasColumnName("gross_amount").HasColumnType("decimal(18,2)");
        builder.Property(x => x.NetAmount).HasColumnName("net_amount").HasColumnType("decimal(18,2)");
        builder.Property(x => x.Currency).HasColumnName("currency").HasMaxLength(3);
        builder.Property(x => x.ProcessedDate).HasColumnName("processed_date");
        builder.Property(x => x.ApprovedDate).HasColumnName("approved_date");
        builder.Property(x => x.PaidDate).HasColumnName("paid_date");
        builder.Property(x => x.ReversedDate).HasColumnName("reversed_date");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by").HasMaxLength(100);
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by").HasMaxLength(100);

        // Relationships
        builder.HasOne(x => x.Period)
            .WithMany(x => x.PayrollRuns)
            .HasForeignKey(x => x.PeriodId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(x => x.RunNumber).IsUnique();
        builder.HasIndex(x => x.PeriodId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.IsActive);
    }
}
