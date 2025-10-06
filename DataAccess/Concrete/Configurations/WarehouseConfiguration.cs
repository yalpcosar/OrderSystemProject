using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Concrete.Configurations
{
    public class WarehouseConfiguration : IEntityTypeConfiguration<Warehouse>
    {
        public void Configure(EntityTypeBuilder<Warehouse> builder)
        {

            builder.ToTable("Warehouses");
            builder.HasKey(w => w.Id);
            builder.Property(w => w.Id).ValueGeneratedOnAdd();
            builder.Property(w => w.ProductId)
                .IsRequired()
                .HasComment("Foreign key to Products table");

            builder.Property(w => w.Quantity)
                .IsRequired()
                .HasDefaultValue(0)
                .HasComment("Available quantity in warehouse");

            builder.Property(w => w.IsAvailableForSale)
                .IsRequired()
                .HasDefaultValue(true)
                .HasComment("Indicates if product is available for sale");


            builder.Property(w => w.CreatedUserId).IsRequired();
            builder.Property(w => w.CreatedDate).IsRequired();
            builder.Property(w => w.LastUpdatedUserId).IsRequired();
            builder.Property(w => w.LastUpdatedDate);
            builder.Property(w => w.Status).IsRequired().HasDefaultValue(true);
            builder.Property(w => w.IsDeleted).IsRequired().HasDefaultValue(false);


            builder.HasIndex(w => w.ProductId)
                .IsUnique()
                .HasDatabaseName("IX_Warehouses_ProductId")
                .HasFilter("[IsDeleted] = 0"); 

            builder.HasIndex(w => w.IsAvailableForSale)
                .HasDatabaseName("IX_Warehouses_IsAvailableForSale");

            builder.HasIndex(w => w.IsDeleted)
                .HasDatabaseName("IX_Warehouses_IsDeleted");

            builder.HasIndex(w => w.Status)
                .HasDatabaseName("IX_Warehouses_Status");


            builder.HasIndex(w => new { w.ProductId, w.IsAvailableForSale, w.Quantity })
                .HasDatabaseName("IX_Warehouses_Product_Availability_Quantity");

            
            builder.HasQueryFilter(w => !w.IsDeleted);

           
            builder.HasOne(w => w.Product)
                .WithOne(p => p.Warehouse)
                .HasForeignKey<Warehouse>(w => w.ProductId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Warehouses_Products_ProductId");

            
            builder.HasCheckConstraint(
                "CK_Warehouses_Quantity_NonNegative",
                "[Quantity] >= 0");
        }
    }
}
