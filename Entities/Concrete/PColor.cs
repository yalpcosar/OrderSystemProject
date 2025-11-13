using Core.Entities;
using System.Collections.Generic;

namespace Entities.Concrete
{
    public class PColor: BaseEntity,IEntity
    {
       public string Name { get; set; }
       public string HexCode { get; set; }

       public virtual ICollection<Product> Products { get; set; }
    }
}
