using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;
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
            var items = await Context.Warehouses
                .Include(w => w.Product)
                .ThenInclude(p => p.PColor)
                .Select(w => new WarehouseItemDto
                {
                    ProductId = w.ProductId,
                    ProductName = w.Product.Name,
                    ColorName = w.Product.PColor.Name,
                    Size = w.Product.Size,
                    Quantity = w.Quantity,
                    IsAvailableForSale = w.IsAvailableForSale
                })
                .ToListAsync();

            return new WarehouseReportDto
            {
                Items = items,
                TotalProducts = items.Count,
                TotalQuantity = items.Sum(i => i.Quantity),
                AvailableForSale = items.Count(i => i.IsAvailableForSale),
                OutOfStock = items.Count(i => i.Quantity == 0)
            };
        }

        public async Task<bool> IsProductAvailableAsync(int productId, int requestedQuantity)
        {
            var warehouse = await Context.Warehouses
                .FirstOrDefaultAsync(w => w.ProductId == productId);

            if (warehouse == null)
                return false;

            return warehouse.IsAvailableForSale && warehouse.Quantity >= requestedQuantity;
        }
    }
}

