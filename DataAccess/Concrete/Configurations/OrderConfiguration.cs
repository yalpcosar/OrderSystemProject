using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Concrete.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {

            builder.ToTable("Orders");


            builder.HasKey(o => o.Id);
            builder.Property(o => o.Id).ValueGeneratedOnAdd();


            builder.Property(o => o.CustomerId)
                .IsRequired()
                .HasComment("Foreign key to Customers table");

            builder.Property(o => o.ProductId)
                .IsRequired()
                .HasComment("Foreign key to Products table");

            builder.Property(o => o.Quantity)
                .IsRequired()
                .HasComment("Ordered quantity");

            builder.Property(o => o.OrderNumber)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnType("varchar(50)")
                .HasComment("Unique order number (e.g., ORD-20250106-ABC123)");

            builder.Property(o => o.OrderDate)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()")
                .HasComment("Date and time when order was created (UTC)");

            builder.Property(o => o.CreatedUserId).IsRequired();
            builder.Property(o => o.CreatedDate).IsRequired();
            builder.Property(o => o.LastUpdatedUserId).IsRequired();
            builder.Property(o => o.LastUpdatedDate);
            builder.Property(o => o.Status).IsRequired().HasDefaultValue(true);
            builder.Property(o => o.IsDeleted).IsRequired().HasDefaultValue(false);

            builder.HasIndex(o => o.OrderNumber)
                .IsUnique()
                .HasDatabaseName("IX_Orders_OrderNumber")
                .HasFilter("[IsDeleted] = 0");

            builder.HasIndex(o => o.CustomerId)
                .HasDatabaseName("IX_Orders_CustomerId");

            builder.HasIndex(o => o.ProductId)
                .HasDatabaseName("IX_Orders_ProductId");

            builder.HasIndex(o => o.OrderDate)
                .HasDatabaseName("IX_Orders_OrderDate");

            builder.HasIndex(o => o.IsDeleted)
                .HasDatabaseName("IX_Orders_IsDeleted");

            builder.HasIndex(o => o.Status)
                .HasDatabaseName("IX_Orders_Status");

            builder.HasIndex(o => new { o.CustomerId, o.OrderDate })
                .HasDatabaseName("IX_Orders_Customer_OrderDate");

            builder.HasIndex(o => new { o.ProductId, o.OrderDate })
                .HasDatabaseName("IX_Orders_Product_OrderDate");

            builder.HasIndex(o => new { o.OrderDate, o.Status })
                .HasDatabaseName("IX_Orders_OrderDate_Status");

            builder.HasQueryFilter(o => !o.IsDeleted);


            builder.HasOne(o => o.Customer)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Orders_Customers_CustomerId");

            builder.HasOne(o => o.Product)
                .WithMany(p => p.Orders)
                .HasForeignKey(o => o.ProductId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Orders_Products_ProductId");

            builder.HasCheckConstraint(
                "CK_Orders_Quantity_Positive",
                "[Quantity] > 0" );
        }
    }
}

