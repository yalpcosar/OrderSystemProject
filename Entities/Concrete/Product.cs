using Core.Entities;
using Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Concrete
{
    public class Product: BaseEntity
    {
        public string Name { get; set; }
        public int ColorId { get; set; }
        public ESize Size { get; set; }

        public virtual Color Color { get; set; }
        public virtual Warehouse Warehouse { get; set; }
    }
}
