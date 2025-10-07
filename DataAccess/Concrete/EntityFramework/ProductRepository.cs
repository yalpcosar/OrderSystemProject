using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Concrete.EntityFramework
{
    public class ProductRepository : EfEntityRepositoryBase<Product, ProjectDbContext>, IProductRepository
    {
        public ProductRepository(ProjectDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<ProductWithStockDto>> GetProductsWithStockAsync()
        {
            return await Context.Products
                .Include(p => p.PColor)
                .Include(p => p.Warehouse)
                .Select(p => new ProductWithStockDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    ColorId = p.ColorId,
                    ColorName = p.PColor.Name,
                    Size = p.Size,
                    Quantity = p.Warehouse != null ? p.Warehouse.Quantity : 0,
                    IsAvailableForSale = p.Warehouse != null && p.Warehouse.IsAvailableForSale,
                    Status = p.Status
                })
                .ToListAsync();
        }
    }
}

