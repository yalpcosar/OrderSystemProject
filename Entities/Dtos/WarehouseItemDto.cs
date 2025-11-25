using Core.Entities;
using Core.Enums;

namespace Entities.Dtos
{
    public class WarehouseItemDto: IDto
    {
        public int WarehouseId { get; set; } = 1;
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ColorName { get; set; }
        public ESize Size { get; set; } 
        public int Quantity { get; set; }
        public bool IsAvailableForSale { get; set; }
    }
}
