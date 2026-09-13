using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QA_Platform.Domain.Entities.Help;

namespace QA_Platform.Infrastructure.Data.Configurations;

public class HelpHeaderConfiguration : IEntityTypeConfiguration<HelpHeader>
{
    public void Configure(EntityTypeBuilder<HelpHeader> builder)
    {
        builder.ToTable("help_headers");

        builder.HasKey(h => h.Id);
        builder.Property(h => h.Id).HasColumnName("id");
        builder.Property(h => h.NodeId).HasColumnName("node_id").IsRequired();
        builder.Property(h => h.ContextKey).HasColumnName("context_key").HasMaxLength(50).IsRequired().HasDefaultValue("page");
        builder.Property(h => h.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(h => h.CreatedAt).HasColumnName("created_at");
        builder.Property(h => h.UpdatedAt).HasColumnName("updated_at");
        builder.Property(h => h.CreatedBy).HasColumnName("created_by").HasMaxLength(100);
        builder.Property(h => h.UpdatedBy).HasColumnName("updated_by").HasMaxLength(100);

        builder.HasIndex(h => new { h.NodeId, h.ContextKey }).IsUnique().HasDatabaseName("uk_help_header");
        builder.HasIndex(h => h.NodeId).HasDatabaseName("idx_help_headers_node");

        builder.HasOne(h => h.Node)
            .WithMany(n => n.HelpHeaders)
            .HasForeignKey(h => h.NodeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
