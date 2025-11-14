using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Concrete.Configurations
{
    public class CustomerConfiguration : BaseConfiguration<Customer>
    {
        public override void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.Property(x => x.CustomerName).IsRequired().HasMaxLength(150);
            builder.Property(x => x.Email).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Address).HasMaxLength(500);
            builder.Property(x => x.PhoneNumber).HasMaxLength(20);
            
            builder.HasMany(x => x.Orders)
                   .WithOne(x => x.Customer)
                   .HasForeignKey(x => x.CustomerId) 
                   .OnDelete(DeleteBehavior.Restrict); 

            builder.HasIndex(x => x.Email).IsUnique();
            builder.HasIndex(x => x.CustomerName);

            base.Configure(builder);

        }
    }
}
