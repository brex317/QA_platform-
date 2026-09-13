using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QA_Platform.Domain.Entities.Help;

namespace QA_Platform.Infrastructure.Data.Configurations;

public class HelpStepConfiguration : IEntityTypeConfiguration<HelpStep>
{
    public void Configure(EntityTypeBuilder<HelpStep> builder)
    {
        builder.ToTable("help_steps");

        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.HelpHeaderId).HasColumnName("help_header_id").IsRequired();
        builder.Property(s => s.StepNumber).HasColumnName("step_number").IsRequired();
        builder.Property(s => s.StepText).HasColumnName("step_text").IsRequired();
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");

        builder.HasIndex(s => s.HelpHeaderId).HasDatabaseName("idx_help_steps_header");
        builder.HasIndex(s => new { s.HelpHeaderId, s.StepNumber }).IsUnique().HasDatabaseName("uk_help_step");

        builder.HasOne(s => s.HelpHeader)
            .WithMany(h => h.Steps)
            .HasForeignKey(s => s.HelpHeaderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
