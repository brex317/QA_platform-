using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QA_Platform.Domain.Entities.HRMS;

namespace QA_Platform.Infrastructure.Data.Configurations;

public class PensionRuleConfiguration : IEntityTypeConfiguration<PensionRule>
{
    public void Configure(EntityTypeBuilder<PensionRule> builder)
    {
        builder.ToTable("pension_rules");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.EmploymentType).HasColumnName("employment_type").HasMaxLength(50).IsRequired();
        builder.Property(x => x.EmployeeRate).HasColumnName("employee_rate").HasColumnType("decimal(5,2)");
        builder.Property(x => x.EmployerRate).HasColumnName("employer_rate").HasColumnType("decimal(5,2)");
        builder.Property(x => x.EffectiveFrom).HasColumnName("effective_from");
        builder.Property(x => x.EffectiveTo).HasColumnName("effective_to");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by").HasMaxLength(100);
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by").HasMaxLength(100);

        // Indexes
        builder.HasIndex(x => x.EmploymentType);
        builder.HasIndex(x => x.IsActive);
    }
}
