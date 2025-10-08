using Business.Handlers.Orders.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Orders.ValidationRules
{
    public class CreateOrderValidator : AbstractValidator<CreateOrderCommand>
    {
        private readonly IWarehouseRepository _warehouseRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IProductRepository _productRepository;

        public CreateOrderValidator(
            IWarehouseRepository warehouseRepository,
            ICustomerRepository customerRepository,
            IProductRepository productRepository)
        {
            _warehouseRepository = warehouseRepository;
            _customerRepository = customerRepository;
            _productRepository = productRepository;

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
                .MustAsync(HaveSufficientStock)
                .WithMessage("Yetersiz stok! Sipariş verilemez.");
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

        private async Task<bool> HaveSufficientStock(CreateOrderCommand command, CancellationToken cancellation)
        {
            var warehouse = await _warehouseRepository.GetAsync(w => w.ProductId == command.ProductId && !w.IsDeleted);
            
            if (warehouse == null)
            {
                return false;
            }

            return warehouse.Quantity >= command.Quantity && warehouse.IsAvailableForSale;
        }
    }
}

