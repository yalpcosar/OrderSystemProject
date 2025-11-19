using Core.Entities;

namespace Entities.Concrete
{
    public class Warehouse: BaseEntity, IEntity
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public bool IsAvailableForSale { get; set; } = true;
 
        public virtual Product Product { get; set; }
    }
}
