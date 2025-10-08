using Business.Handlers.Products.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Products.ValidationRules
{
    public class CreateProductValidator : AbstractValidator<CreateProductCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IColorRepository _colorRepository;

        public CreateProductValidator(IProductRepository productRepository, IColorRepository colorRepository)
        {
            _productRepository = productRepository;
            _colorRepository = colorRepository;

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Ürün adı zorunludur")
                .MaximumLength(100).WithMessage("Ürün adı 100 karakteri geçemez");

            RuleFor(x => x.ColorId)
                .NotEmpty().WithMessage("Renk ID zorunludur")
                .MustAsync(ColorExists)
                .WithMessage("Renk bulunamadı");

            RuleFor(x => x.Size)
                .IsInEnum().WithMessage("Geçersiz beden değeri");

            RuleFor(x => x)
                .MustAsync(BeUniqueProduct)
                .WithMessage("Bu isim, renk ve beden kombinasyonu zaten mevcut");
        }

        private async Task<bool> ColorExists(int colorId, CancellationToken cancellation)
        {
            var color = await _colorRepository.GetAsync(c => c.Id == colorId && !c.IsDeleted);
            return color != null;
        }

        private async Task<bool> BeUniqueProduct(CreateProductCommand command, CancellationToken cancellation)
        {
            var existingProduct = await _productRepository.GetAsync(p => 
                p.Name == command.Name && 
                p.ColorId == command.ColorId && 
                p.Size == command.Size &&
                !p.IsDeleted);
            
            return existingProduct == null;
        }
    }
}
