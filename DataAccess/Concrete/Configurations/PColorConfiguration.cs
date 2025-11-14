using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace DataAccess.Concrete.Configurations
{
    public class PColorConfiguration : BaseConfiguration<PColor>
    {
        public override void Configure(EntityTypeBuilder<PColor> builder)
        {
            builder.Property(c => c.Name).IsRequired().HasMaxLength(50);
            builder.Property(c => c.HexCode).IsRequired().HasMaxLength(7);

            builder.HasMany(x => x.Products)
                   .WithOne(x => x.PColor)
                   .HasForeignKey(x => x.PColorId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => x.Name).IsUnique();
            builder.HasIndex(x => x.HexCode);

            base.Configure(builder);

        }
    }
}
