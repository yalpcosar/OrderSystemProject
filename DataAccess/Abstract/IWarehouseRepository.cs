using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System.Threading.Tasks;

namespace DataAccess.Abstract
{
    public interface IWarehouseRepository : IEntityRepository<Warehouse>
    {
        Task<WarehouseReportDto> GetWarehouseReportAsync();
        Task<WarehouseItemDto> GetWarehouseItemByProductIdAsync(int productId);
    }
}

