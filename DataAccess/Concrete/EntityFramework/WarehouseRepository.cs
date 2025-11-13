using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;
using Entities.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Concrete.EntityFramework
{
    public class WarehouseRepository : EfEntityRepositoryBase<Warehouse, ProjectDbContext>, IWarehouseRepository
    {
        public WarehouseRepository(ProjectDbContext context)
            : base(context)
        {

        }

        public Task<WarehouseReportDto> GetWarehouseReportAsync()
        {
            throw new System.NotImplementedException();
        }

        public Task<bool> IsProductAvailableAsync(int productId, int requestedQuantity)
        {
            throw new System.NotImplementedException();
        }
    }
}

