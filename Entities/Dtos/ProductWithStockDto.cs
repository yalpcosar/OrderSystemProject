using Core.Entities;
using Core.Enums;

namespace Entities.Dtos
{
    public class ProductWithStockDto: IDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ColorId { get; set; }
        public string ColorName { get; set; }
        public ESize Size { get; set; }
        public int Quantity { get; set; }
        public bool IsAvailableForSale { get; set; }
        public bool Status { get; set; }
    }
}
