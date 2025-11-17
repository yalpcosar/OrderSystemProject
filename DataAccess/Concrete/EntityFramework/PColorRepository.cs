using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;

namespace DataAccess.Concrete.EntityFramework
{
    public class PColorRepository : EfEntityRepositoryBase<PColor, ProjectDbContext>, IPColorRepository
    {
        public PColorRepository(ProjectDbContext context)
            : base(context)
        {
        }
    }
}

