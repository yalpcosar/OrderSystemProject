using Core.Enums;
using System;

namespace Entities.Dtos
{
    public class OrderDetailDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }

        // Customer
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerCode { get; set; }

        // Product
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ColorName { get; set; }
        public ESize Size { get; set; }

        // Order
        public int Quantity { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
