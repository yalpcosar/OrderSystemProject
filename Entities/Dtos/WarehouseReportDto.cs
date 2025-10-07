using System.Collections.Generic;

namespace Entities.Dtos
{
    public class WarehouseReportDto
    {
        public IEnumerable<WarehouseItemDto> Items { get; set; }
        public int TotalProducts { get; set; }
        public int TotalQuantity { get; set; }
        public int AvailableForSale { get; set; }
        public int OutOfStock { get; set; }
    }
}
