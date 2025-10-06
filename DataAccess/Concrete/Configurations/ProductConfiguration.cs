using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Concrete.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            // Table Configuration
            builder.ToTable("Products");

            // Primary Key
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).ValueGeneratedOnAdd();

            // Product-specific Properties
            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)")
                .HasComment("Product name");

            builder.Property(p => p.ColorId)
                .IsRequired()
                .HasComment("Foreign key to Colors table");

            
            builder.Property(p => p.Size)
                .IsRequired()
                .HasConversion<int>() 
                .HasComment("Product size: 1=S, 2=M, 3=L, 4=XL");

            // BaseEntity Properties
            builder.Property(p => p.CreatedUserId).IsRequired();
            builder.Property(p => p.CreatedDate).IsRequired();
            builder.Property(p => p.LastUpdatedUserId).IsRequired();
            builder.Property(p => p.LastUpdatedDate);
            builder.Property(p => p.Status).IsRequired().HasDefaultValue(true);
            builder.Property(p => p.IsDeleted).IsRequired().HasDefaultValue(false);

            // Indexes
            builder.HasIndex(p => new { p.Name, p.ColorId, p.Size })
                .IsUnique()
                .HasDatabaseName("IX_Products_Name_Color_Size")
                .HasFilter("[IsDeleted] = 0"); 

            builder.HasIndex(p => p.ColorId)
                .HasDatabaseName("IX_Products_ColorId");

            builder.HasIndex(p => p.Size)
                .HasDatabaseName("IX_Products_Size");

            builder.HasIndex(p => p.IsDeleted)
                .HasDatabaseName("IX_Products_IsDeleted");

            builder.HasIndex(p => p.Status)
                .HasDatabaseName("IX_Products_Status");

            builder.HasQueryFilter(p => !p.IsDeleted);

            // Relationships
            builder.HasOne(p => p.PColor)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.ColorId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Products_Colors_ColorId");
        }
    }
}
