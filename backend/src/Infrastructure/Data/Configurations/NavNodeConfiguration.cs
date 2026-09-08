using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QA_Platform.Domain.Entities.Navigation;

namespace QA_Platform.Infrastructure.Data.Configurations;

public class NavNodeConfiguration : IEntityTypeConfiguration<NavNode>
{
    public void Configure(EntityTypeBuilder<NavNode> builder)
    {
        builder.ToTable("nav_nodes");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.NodeKey).HasColumnName("node_key").HasMaxLength(150).IsRequired();
        builder.Property(x => x.ParentId).HasColumnName("parent_id");
        builder.Property(x => x.Title).HasColumnName("title").HasMaxLength(150).IsRequired();
        builder.Property(x => x.RouteUrl).HasColumnName("route_url").HasMaxLength(255);
        builder.Property(x => x.Icon).HasColumnName("icon").HasMaxLength(80);
        builder.Property(x => x.DisplayOrder).HasColumnName("display_order");
        builder.Property(x => x.Depth).HasColumnName("depth");
        builder.Property(x => x.IsActive).HasColumnName("is_active");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by").HasMaxLength(100);
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by").HasMaxLength(100);

        // Indexes
        builder.HasIndex(x => x.NodeKey).IsUnique();
        builder.HasIndex(x => x.ParentId);
        builder.HasIndex(x => x.IsActive);

        // Self-referencing relationship
        builder.HasOne(x => x.Parent)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
