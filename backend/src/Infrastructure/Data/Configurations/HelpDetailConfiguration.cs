using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QA_Platform.Domain.Entities.Help;

namespace QA_Platform.Infrastructure.Data.Configurations;

public class HelpDetailConfiguration : IEntityTypeConfiguration<HelpDetail>
{
    public void Configure(EntityTypeBuilder<HelpDetail> builder)
    {
        builder.ToTable("help_details");

        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id).HasColumnName("id");
        builder.Property(d => d.HelpHeaderId).HasColumnName("help_header_id").IsRequired();
        builder.Property(d => d.StepNumber).HasColumnName("step_number").IsRequired();
        builder.Property(d => d.StepText).HasColumnName("step_text").IsRequired();
        builder.Property(d => d.CreatedAt).HasColumnName("created_at");

        builder.HasIndex(d => d.HelpHeaderId).HasDatabaseName("idx_help_details_header");
        builder.HasIndex(d => new { d.HelpHeaderId, d.StepNumber }).IsUnique().HasDatabaseName("uk_help_detail_step");

        builder.HasOne(d => d.HelpHeader)
            .WithMany(h => h.Details)
            .HasForeignKey(d => d.HelpHeaderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
