using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Concrete.EntityFramework
{
    public class OrderRepository : EfEntityRepositoryBase<Order, ProjectDbContext>, IOrderRepository
    {
        public OrderRepository(ProjectDbContext context)
            : base(context)
        {
        }
        public async Task<IEnumerable<OrderDetailDto>> GetOrdersWithDetailsAsync()
        {
            return await Context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Product)
                .ThenInclude(p => p.PColor)
                .Select(o => new OrderDetailDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    OrderDate = o.OrderDate,
                    CustomerId = o.CustomerId,
                    CustomerName = o.Customer.CustomerName,
                    CustomerCode = o.Customer.CustomerCode,
                    ProductId = o.ProductId,
                    ProductName = o.Product.Name,
                    ColorName = o.Product.PColor.Name,
                    Size = o.Product.Size,
                    Quantity = o.Quantity,
                    Status = o.Status,
                    CreatedDate = o.CreatedDate
                })
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<OrderDetailDto>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await Context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Product)
                .ThenInclude(p => p.PColor)
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
                .Select(o => new OrderDetailDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    OrderDate = o.OrderDate,
                    CustomerId = o.CustomerId,
                    CustomerName = o.Customer.CustomerName,
                    CustomerCode = o.Customer.CustomerCode,
                    ProductId = o.ProductId,
                    ProductName = o.Product.Name,
                    ColorName = o.Product.PColor.Name,
                    Size = o.Product.Size,
                    Quantity = o.Quantity,
                    Status = o.Status,
                    CreatedDate = o.CreatedDate
                })
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }
    }
}

