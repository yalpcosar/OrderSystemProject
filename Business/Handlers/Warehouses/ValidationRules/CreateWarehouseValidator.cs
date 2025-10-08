using Business.Handlers.Warehouses.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Warehouses.ValidationRules
{
    public class CreateWarehouseValidator : AbstractValidator<CreateWarehouseCommand>
    {
        private readonly IProductRepository _productRepository;

        public CreateWarehouseValidator(IProductRepository productRepository)
        {
            _productRepository = productRepository;

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Ürün ID zorunludur")
                .MustAsync(ProductExists)
                .WithMessage("Ürün bulunamadı");

            RuleFor(x => x.Quantity)
                .GreaterThanOrEqualTo(0).WithMessage("Miktar 0'dan küçük olamaz");
        }

        private async Task<bool> ProductExists(int productId, CancellationToken cancellation)
        {
            var product = await _productRepository.GetAsync(p => p.Id == productId && !p.IsDeleted);
            return product != null;
        }
    }
}

