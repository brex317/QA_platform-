using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QA_Platform.Domain.Entities.HRMS;

namespace QA_Platform.Infrastructure.Data.Configurations;

public class PayrollJournalConfiguration : IEntityTypeConfiguration<PayrollJournal>
{
    public void Configure(EntityTypeBuilder<PayrollJournal> builder)
    {
        builder.ToTable("payroll_journals");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.RunId).HasColumnName("run_id");
        builder.Property(x => x.JournalNumber).HasColumnName("journal_number").HasMaxLength(50).IsRequired();
        builder.Property(x => x.JournalDate).HasColumnName("journal_date");
        builder.Property(x => x.DebitAmount).HasColumnName("debit_amount").HasColumnType("decimal(18,2)");
        builder.Property(x => x.CreditAmount).HasColumnName("credit_amount").HasColumnType("decimal(18,2)");
        builder.Property(x => x.Currency).HasColumnName("currency").HasMaxLength(3);
        builder.Property(x => x.Status).HasColumnName("status").HasMaxLength(20)
            .HasConversion<string>();
        builder.Property(x => x.PostedDate).HasColumnName("posted_date");
        builder.Property(x => x.ReversedDate).HasColumnName("reversed_date");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by").HasMaxLength(100);
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by").HasMaxLength(100);

        // Relationships
        builder.HasOne(x => x.Run)
            .WithMany(x => x.PayrollJournals)
            .HasForeignKey(x => x.RunId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(x => x.JournalNumber).IsUnique();
        builder.HasIndex(x => x.RunId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.IsActive);
    }
}
