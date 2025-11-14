using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Entities.Concrete
{
    public class Customer: BaseEntity, IEntity
    {
        public string CustomerName { get; set; }
        public string CustomerCode { get; set; }
        public Customer()
        {
            CustomerCode = GenerateRandomCode();
        }
        private static string GenerateRandomCode()
        {
          const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

          return new string(Enumerable.Repeat(chars, 11)
           .Select(s => s[new Random().Next(s.Length)]).ToArray());
        }

        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public virtual ICollection<Order> Orders { get; set; }

    }
}
