using Core.Entities;
using Core.Enums;
using System;

namespace Entities.Dtos
{
    public class OrderDetailDto: IDto
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public int Quantity { get; set; }
        public bool Status { get; set; }

        // Customer
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerCode { get; set; }

        // Product
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ColorName { get; set; }
        public ESize Size { get; set; }
    
    }
}
