using Core.Enums;
using Org.BouncyCastle.Asn1.Esf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public class ProductWithStockDto
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
