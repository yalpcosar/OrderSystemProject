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


        public async Task<WarehouseReportDto> GetWarehouseReportAsync()
        {
            var query = Context.Warehouses
            .Include(w => w.Product)
                .ThenInclude(p => p.PColor)
            .Where(w => w.IsDeleted == false && w.Product.IsDeleted == false);

            var reportItems = await query.Select(w => new WarehouseItemDto
            {
                WarehouseId = w.Id,
                ProductId = w.ProductId,
                ProductName = w.Product.Name,
                ColorName = w.Product.PColor.Name,
                Size = w.Product.Size,
                Quantity = w.Quantity,
                IsAvailableForSale = w.IsAvailableForSale

            }).ToListAsync();

            int totalProducts = reportItems.Count();
            int outOfStockCount = reportItems.Count(x => x.Quantity <= 0);

            var finalReport = new WarehouseReportDto
            {
                Items = reportItems,
                OutOfStock = outOfStockCount,
            };

            return finalReport;
        }
        public async Task<WarehouseItemDto> GetWarehouseItemByProductIdAsync(int productId)
        {
            return await Context.Warehouses
                .Include(w => w.Product)
                .ThenInclude(p => p.PColor)
                .Where(w => w.ProductId == productId && w.IsDeleted == false && w.Product.IsDeleted == false)
                .Select(w => new WarehouseItemDto
                {
                    WarehouseId = w.Id,
                    ProductId = w.ProductId,
                    ProductName = w.Product.Name,
                    ColorName = w.Product.PColor.Name,
                    Size = w.Product.Size,
                    Quantity = w.Quantity,
                    IsAvailableForSale = w.IsAvailableForSale
                })
                .FirstOrDefaultAsync();
        }
    }
}

