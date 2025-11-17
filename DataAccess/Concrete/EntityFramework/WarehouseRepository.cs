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
            .Where(w => w.IsAvailableForSale == true && w.IsDeleted == false);
                
            var reportItems = await query.Select(w => new WarehouseItemDto
            {
             ProductId = w.ProductId,
             ProductName = w.Product.Name,
             ColorName = w.Product.PColor.Name,
             Size = w.Product.Size,
             Quantity = w.Quantity,
             IsAvailableForSale = w.IsAvailableForSale

            }).ToListAsync();

            int totalProducts = reportItems.Count();
            int totalQuantity = reportItems.Sum(x => x.Quantity);
            int outOfStockCount = await Context.Warehouses.CountAsync(x => x.Quantity == 0 && x.IsAvailableForSale == false);

            var finalReport = new WarehouseReportDto
            {
                Items = reportItems,
                TotalProducts = totalProducts,
                TotalQuantity = totalQuantity,
                OutOfStock = outOfStockCount,
                IsAvailableForSale = true
            };

            return finalReport;
        }
        
        public async Task<bool> IsProductAvailableAsync(int productId, int requestedQuantity)
        {
           var warehouseItem = await Context.Warehouses
           .FirstOrDefaultAsync(x => x.ProductId == productId && x.IsDeleted == false);

           if(warehouseItem == null || warehouseItem.IsAvailableForSale == false)
            {
                return false;
            }

            return warehouseItem.Quantity >= requestedQuantity;
        }
    }
}

