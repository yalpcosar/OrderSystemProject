using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace DataAccess.Concrete.Configurations
{
    public class PColorConfiguration : IEntityTypeConfiguration<PColor>
    {
        public void Configure(EntityTypeBuilder<PColor> builder)
        {
            
            builder.ToTable("Colors");

            
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id)
                .ValueGeneratedOnAdd();

           
            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnType("nvarchar(50)")
                .HasComment("Color name (e.g., Red, Blue, Green)");

            builder.Property(c => c.HexCode)
                .HasMaxLength(7)
                .HasColumnType("varchar(7)")
                .HasComment("Hex color code (e.g., #FF0000)");

            
            builder.Property(c => c.CreatedUserId)
                .IsRequired()
                .HasComment("User who created this record");

            builder.Property(c => c.CreatedDate)
                .IsRequired()
                .HasComment("Creation date/time in UTC");

            builder.Property(c => c.LastUpdatedUserId)
                .IsRequired()
                .HasComment("User who last updated this record");

            builder.Property(c => c.LastUpdatedDate)
                .HasComment("Last update date/time in UTC");

            builder.Property(c => c.Status)
                .IsRequired()
                .HasDefaultValue(true)
                .HasComment("Active/Inactive status");

            builder.Property(c => c.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasComment("Soft delete flag");

          
            builder.HasIndex(c => c.Name)
                .IsUnique()
                .HasDatabaseName("IX_Colors_Name")
                .HasFilter("[IsDeleted] = 0");

            builder.HasIndex(c => c.IsDeleted)
                .HasDatabaseName("IX_Colors_IsDeleted");

            builder.HasIndex(c => c.Status)
                .HasDatabaseName("IX_Colors_Status");

            
            builder.HasQueryFilter(c => !c.IsDeleted);
        }
    }
}
