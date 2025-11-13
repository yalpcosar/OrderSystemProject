using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace DataAccess.Concrete.Configurations
{
    public class PColorConfiguration : BaseConfiguration<PColor>
    {
        public override void Configure(EntityTypeBuilder<PColor> builder)
        {
            
           
        }
    }
}
