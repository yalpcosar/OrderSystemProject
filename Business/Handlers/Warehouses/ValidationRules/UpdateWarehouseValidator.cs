using Business.Handlers.Warehouses.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Warehouses.ValidationRules
{
    public class UpdateWarehouseValidator : AbstractValidator<UpdateWarehouseCommand>
    {
        private readonly IWarehouseRepository _warehouseRepository;
        private readonly IProductRepository _productRepository;

        public UpdateWarehouseValidator(IWarehouseRepository warehouseRepository, IProductRepository productRepository)
        {
            _warehouseRepository = warehouseRepository;
            _productRepository = productRepository;

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Depo ID zorunludur")
                .MustAsync(WarehouseExists)
                .WithMessage("Depo bulunamadı");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Ürün ID zorunludur")
                .MustAsync(ProductExists)
                .WithMessage("Ürün bulunamadı");

            RuleFor(x => x.Quantity)
                .GreaterThanOrEqualTo(0).WithMessage("Miktar 0'dan küçük olamaz");
        }

        private async Task<bool> WarehouseExists(int warehouseId, CancellationToken cancellation)
        {
            var warehouse = await _warehouseRepository.GetAsync(w => w.Id == warehouseId && !w.IsDeleted);
            return warehouse != null;
        }

        private async Task<bool> ProductExists(int productId, CancellationToken cancellation)
        {
            var product = await _productRepository.GetAsync(p => p.Id == productId && !p.IsDeleted);
            return product != null;
        }
    }
}

