using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;
using Entities.Dtos;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Concrete.EntityFramework
{
    public class ProductRepository : EfEntityRepositoryBase<Product, ProjectDbContext>, IProductRepository
    {
        public ProductRepository(ProjectDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<ProductDetailDto>> GetProductDetailAsync()
        {
            var query = Context.Products
                .Include(p => p.PColor)
                .Include(p => p.Warehouse)
                .Where(p => p.IsDeleted == false);
            
            return await query.Select(p => new ProductDetailDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                Size = p.Size,
                ColorName = p.PColor.Name,
                ColorHexCode = p.PColor.HexCode,
                Quantity = p.Warehouse == null ? 0 : p.Warehouse.Quantity,
                IsAvailableForSale = p.Warehouse != null ? p.Warehouse.IsAvailableForSale : false
            }).ToListAsync();


        }
    }
}

