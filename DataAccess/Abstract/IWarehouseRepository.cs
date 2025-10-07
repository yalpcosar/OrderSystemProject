using Core.DataAccess;
using Entities.Concrete;
using System.Threading.Tasks;

namespace DataAccess.Abstract
{
    public interface IWarehouseRepository : IEntityRepository<Warehouse>
    {
        Task<WarehouseReportDto> GetWarehouseReportAsync();
        Task<bool> IsProductAvailableAsync(int productId, int requestedQuantity);
    }
}

