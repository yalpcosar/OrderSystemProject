using Business.Handlers.Products.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Products.ValidationRules
{
    public class DeleteProductValidator : AbstractValidator<DeleteProductCommand>
    {
        private readonly IProductRepository _productRepository;

        public DeleteProductValidator(IProductRepository productRepository)
        {
            _productRepository = productRepository;

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Ürün ID zorunludur")
                .MustAsync(ProductExists)
                .WithMessage("Ürün bulunamadı");
        }

        private async Task<bool> ProductExists(int productId, CancellationToken cancellation)
        {
            var product = await _productRepository.GetAsync(p => p.Id == productId && !p.IsDeleted);
            return product != null;
        }
    }
}

