using Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public class WarehouseItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ColorName { get; set; }
        public ESize Size { get; set; } 
        public int Quantity { get; set; }
        public bool IsAvailableForSale { get; set; }
    }
}
