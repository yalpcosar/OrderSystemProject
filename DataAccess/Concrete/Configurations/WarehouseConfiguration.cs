using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Concrete.Configurations
{
    public class WarehouseConfiguration : BaseConfiguration<Warehouse>
    {
        public override void Configure(EntityTypeBuilder<Warehouse> builder)
        {
            builder.Property(w => w.ProductId).IsRequired();
            builder.Property(w => w.Quantity).IsRequired();

            builder.HasOne(x => x.Product)
                   .WithOne(x => x.Warehouse) //??? bir ürünün birden fazala deposu olmalı mı ???
                   .HasForeignKey<Warehouse>(x => x.ProductId) 
                   .OnDelete(DeleteBehavior.Restrict);

            // Bu, bir ürünün birden fazla depo/stok kaydı olmasını
            // veritabanı seviyesinde engeller (Bire-Bir ilişkiyi garantiler).
            builder.HasIndex(w => w.ProductId).IsUnique();
            
            base.Configure(builder);
        }
    }
}
