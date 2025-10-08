using Business.Handlers.Orders.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Orders.ValidationRules
{
    public class UpdateOrderValidator : AbstractValidator<UpdateOrderCommand>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IWarehouseRepository _warehouseRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IProductRepository _productRepository;

        public UpdateOrderValidator(
            IOrderRepository orderRepository,
            IWarehouseRepository warehouseRepository,
            ICustomerRepository customerRepository,
            IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _warehouseRepository = warehouseRepository;
            _customerRepository = customerRepository;
            _productRepository = productRepository;

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Sipariş ID zorunludur")
                .MustAsync(OrderExists)
                .WithMessage("Sipariş bulunamadı");

            RuleFor(x => x.CustomerId)
                .NotEmpty().WithMessage("Müşteri ID zorunludur")
                .MustAsync(CustomerExists)
                .WithMessage("Müşteri bulunamadı");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Ürün ID zorunludur")
                .MustAsync(ProductExists)
                .WithMessage("Ürün bulunamadı");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Miktar 0'dan büyük olmalıdır");

            RuleFor(x => x)
                .MustAsync(HaveSufficientStockForUpdate)
                .WithMessage("Yetersiz stok! Sipariş güncellenemez.");
        }

        private async Task<bool> OrderExists(int orderId, CancellationToken cancellation)
        {
            var order = await _orderRepository.GetAsync(o => o.Id == orderId && !o.IsDeleted);
            return order != null;
        }

        private async Task<bool> CustomerExists(int customerId, CancellationToken cancellation)
        {
            var customer = await _customerRepository.GetAsync(c => c.Id == customerId && !c.IsDeleted);
            return customer != null;
        }

        private async Task<bool> ProductExists(int productId, CancellationToken cancellation)
        {
            var product = await _productRepository.GetAsync(p => p.Id == productId && !p.IsDeleted);
            return product != null;
        }

        private async Task<bool> HaveSufficientStockForUpdate(UpdateOrderCommand command, CancellationToken cancellation)
        {
            var currentOrder = await _orderRepository.GetAsync(o => o.Id == command.Id);
            var warehouse = await _warehouseRepository.GetAsync(w => w.ProductId == command.ProductId && !w.IsDeleted);
            
            if (warehouse == null || !warehouse.IsAvailableForSale)
            {
                return false;
            }

            // If same product, check if available stock + old order quantity >= new quantity
            if (currentOrder.ProductId == command.ProductId)
            {
                var availableStock = warehouse.Quantity + currentOrder.Quantity;
                return availableStock >= command.Quantity;
            }
            else
            {
                // Different product, just check if warehouse has enough
                return warehouse.Quantity >= command.Quantity;
            }
        }
    }
}

