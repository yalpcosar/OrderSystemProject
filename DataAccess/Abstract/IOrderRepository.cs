using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccess.Abstract
{
    public interface IOrderRepository : IEntityRepository<Order>
    {
        Task<IEnumerable<OrderDetailDto>> GetOrdersWithDetailsAsync();
        Task<IEnumerable<OrderDetailDto>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<OrderDetailDto> GetOrderDetailsByIdAsync(int orderId);
    }
}

