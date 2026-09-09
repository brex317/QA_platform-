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
        builder.Property(h => h.Title).HasColumnName("title").HasMaxLength(255).HasDefaultValue("Quick steps");
        builder.Property(h => h.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(h => h.CreatedAt).HasColumnName("created_at");
        builder.Property(h => h.UpdatedAt).HasColumnName("updated_at");
        builder.Property(h => h.CreatedBy).HasColumnName("created_by").HasMaxLength(100);
        builder.Property(h => h.UpdatedBy).HasColumnName("updated_by").HasMaxLength(100);

        builder.HasIndex(h => h.NodeId).IsUnique().HasDatabaseName("uk_help_header_node");
        builder.HasIndex(h => h.IsActive).HasDatabaseName("idx_help_headers_active");

        builder.HasOne(h => h.Node)
            .WithMany()
            .HasForeignKey(h => h.NodeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
