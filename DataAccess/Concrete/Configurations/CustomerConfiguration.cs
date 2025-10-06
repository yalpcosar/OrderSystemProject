using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Concrete.Configurations
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {

            builder.ToTable("Customers");


            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id).ValueGeneratedOnAdd();

        
            builder.Property(c => c.CustomerName)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("nvarchar(100)")
                .HasComment("Full name of the customer");

            builder.Property(c => c.CustomerCode)
                .IsRequired()
                .HasMaxLength(20)
                .HasColumnType("varchar(20)")
                .HasComment("Unique customer code (e.g., CUST-001)");

            builder.Property(c => c.Address)
                .HasMaxLength(500)
                .HasColumnType("nvarchar(500)")
                .HasComment("Customer's full address");

            builder.Property(c => c.PhoneNumber)
                .IsRequired()
                .HasMaxLength(20)
                .HasColumnType("varchar(20)")
                .HasComment("Customer's phone number");

            builder.Property(c => c.Email)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)")
                .HasComment("Customer's email address");

         
            builder.Property(c => c.CreatedUserId).IsRequired();
            builder.Property(c => c.CreatedDate).IsRequired();
            builder.Property(c => c.LastUpdatedUserId).IsRequired();
            builder.Property(c => c.LastUpdatedDate);
            builder.Property(c => c.Status).IsRequired().HasDefaultValue(true);
            builder.Property(c => c.IsDeleted).IsRequired().HasDefaultValue(false);

         
            builder.HasIndex(c => c.CustomerCode)
                .IsUnique()
                .HasDatabaseName("IX_Customers_CustomerCode")
                .HasFilter("[IsDeleted] = 0");

            builder.HasIndex(c => c.Email)
                .IsUnique()
                .HasDatabaseName("IX_Customers_Email")
                .HasFilter("[IsDeleted] = 0");

            builder.HasIndex(c => c.PhoneNumber)
                .HasDatabaseName("IX_Customers_PhoneNumber");

            builder.HasIndex(c => c.IsDeleted)
                .HasDatabaseName("IX_Customers_IsDeleted");

            builder.HasIndex(c => c.Status)
                .HasDatabaseName("IX_Customers_Status");

           
            builder.HasQueryFilter(c => !c.IsDeleted);
        }
    }
}
