using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Concrete
{
    public class Color: BaseEntity
    {
       public string Name { get; set; }
       public string HexCode { get; set; }
    }
}
