using Core.Entities;
using Core.Enums;
using System.Collections.Generic;

namespace Entities.Concrete
{
    public class Product: BaseEntity, IEntity
    {
        public string Name { get; set; }
        public ESize Size { get; set; }
        public virtual PColor PColor { get; set; }
        public virtual Warehouse Warehouse { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
