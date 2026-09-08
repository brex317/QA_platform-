using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QA_Platform.Domain.Entities.HRMS;

namespace QA_Platform.Infrastructure.Data.Configurations;

public class PayslipConfiguration : IEntityTypeConfiguration<Payslip>
{
    public void Configure(EntityTypeBuilder<Payslip> builder)
    {
        builder.ToTable("payslips");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.PayrollRunId).HasColumnName("payroll_run_id");
        builder.Property(x => x.EmployeeId).HasColumnName("employee_id");
        builder.Property(x => x.GrossPay).HasColumnName("gross_pay").HasColumnType("decimal(15,2)");
        builder.Property(x => x.TaxDeduction).HasColumnName("tax_deduction").HasColumnType("decimal(15,2)");
        builder.Property(x => x.PensionDeduction).HasColumnName("pension_deduction").HasColumnType("decimal(15,2)");
        builder.Property(x => x.OtherDeductions).HasColumnName("other_deductions").HasColumnType("decimal(15,2)");
        builder.Property(x => x.NetPay).HasColumnName("net_pay").HasColumnType("decimal(15,2)");
        builder.Property(x => x.Currency).HasColumnName("currency").HasMaxLength(3);
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by").HasMaxLength(100);
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by").HasMaxLength(100);

        // Relationships
        builder.HasOne(x => x.PayrollRun)
            .WithMany(x => x.Payslips)
            .HasForeignKey(x => x.PayrollRunId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Employee)
            .WithMany(x => x.Payslips)
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(x => x.PayrollRunId);
        builder.HasIndex(x => x.EmployeeId);
        builder.HasIndex(x => x.IsActive);
    }
}
