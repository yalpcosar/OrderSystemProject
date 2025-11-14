using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Concrete.Configurations
{
    public class ProductConfiguration : BaseConfiguration<Product>
    {
        public override void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(p => p.Name).IsRequired().HasMaxLength(150);
            builder.Property(p => p.Size).IsRequired();
            builder.Property(p => p.PColorId).IsRequired();
      
            builder.HasOne(x => x.PColor)
                   .WithMany(x => x.Products)
                   .HasForeignKey(x => x.PColorId) 
                   .OnDelete(DeleteBehavior.Restrict); 

            builder.HasOne(x => x.Warehouse)
                   .WithOne(x => x.Product) 
                   .HasForeignKey<Warehouse>(x => x.ProductId) 
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Orders)
                   .WithOne(x => x.Product)
                   .HasForeignKey(x => x.ProductId)
                   .OnDelete(DeleteBehavior.Restrict);
   
            builder.HasIndex(x => x.Name).IsUnique();
            builder.HasIndex(x => x.PColorId);

            base.Configure(builder);

        }
    }
}
