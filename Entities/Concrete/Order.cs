using Core.Entities;
using System;

namespace Entities.Concrete
{
    public class Order: BaseEntity, IEntity
    {

        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual Product Product { get; set; }
    }
}
