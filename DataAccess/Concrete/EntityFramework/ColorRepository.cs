using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;

namespace DataAccess.Concrete.EntityFramework
{
    public class ColorRepository : EfEntityRepositoryBase<PColor, ProjectDbContext>, IColorRepository
    {
        public ColorRepository(ProjectDbContext context)
            : base(context)
        {
        }
    }
}

