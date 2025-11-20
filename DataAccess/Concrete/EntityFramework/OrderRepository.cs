using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;
using Entities.Dtos;
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

        public async Task<OrderDetailDto> GetOrderDetailsByIdAsync(int orderId)
        {
            var query = Context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Product)
                .ThenInclude(p => p.PColor)
          .Where(o => o.Id == orderId && o.IsDeleted == false);


            return await query.Select(o => new OrderDetailDto
            {
                OrderId = o.Id,
                OrderDate = o.CreatedDate,
                Quantity = o.Quantity,
                Status = o.Status,

                // Customer
                CustomerId = o.CustomerId,
                CustomerName = o.Customer.CustomerName,
                CustomerCode = o.Customer.CustomerCode,

                // Product
                ProductId = o.ProductId,
                ProductName = o.Product.Name,
                ColorName = o.Product.PColor.Name,
                Size = o.Product.Size
            })
            .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<OrderDetailDto>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var query = Context.Orders
             .Include(o => o.Customer)
             .Include(o => o.Product)
                 .ThenInclude(p => p.PColor)
             .Where(o => o.IsDeleted == false &&
                 o.CreatedDate >= startDate &&
                 o.CreatedDate <= endDate);

            return await query.Select(o => new OrderDetailDto
            {
                OrderId = o.Id,
                OrderDate = o.CreatedDate,
                Quantity = o.Quantity,
                Status = o.Status,


                CustomerId = o.CustomerId,
                CustomerName = o.Customer.CustomerName,
                CustomerCode = o.Customer.CustomerCode,


                ProductId = o.Product.Id,
                ProductName = o.Product.Name,
                ColorName = o.Product.PColor.Name,
                Size = o.Product.Size

            }).ToListAsync();
        }

        public async Task<IEnumerable<OrderDetailDto>> GetOrdersWithDetailsAsync()
        {
            var query = Context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Product)
                .ThenInclude(p => p.PColor)
            .Where(o => o.IsDeleted == false);

            return await query.Select(o => new OrderDetailDto()
            {
                OrderId = o.Id,
                OrderDate = o.CreatedDate,
                Quantity = o.Quantity,
                Status = o.Status,


                CustomerId = o.CustomerId,
                CustomerName = o.Customer.CustomerName,
                CustomerCode = o.Customer.CustomerCode,


                ProductId = o.Product.Id,
                ProductName = o.Product.Name,
                ColorName = o.Product.PColor.Name,
                Size = o.Product.Size

            }).ToListAsync();
        }
    }
}

