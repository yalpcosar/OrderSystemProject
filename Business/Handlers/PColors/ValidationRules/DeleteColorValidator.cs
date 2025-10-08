using Business.Handlers.PColors.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.PColors.ValidationRules
{
    public class DeleteColorValidator : AbstractValidator<DeleteColorCommand>
    {
        private readonly IColorRepository _colorRepository;
        private readonly IProductRepository _productRepository;

        public DeleteColorValidator(IColorRepository colorRepository, IProductRepository productRepository)
        {
            _colorRepository = colorRepository;
            _productRepository = productRepository;

            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Geçersiz renk ID")
                .MustAsync(ColorExists).WithMessage("Renk bulunamadı")
                .MustAsync(ColorNotUsedInProducts).WithMessage("Bu renk ürünlerde kullanıldığı için silinemez");
        }

        private async Task<bool> ColorExists(int id, CancellationToken cancellation)
        {
            var color = await _colorRepository.GetAsync(c => c.Id == id && !c.IsDeleted);
            return color != null;
        }

        private async Task<bool> ColorNotUsedInProducts(int id, CancellationToken cancellation)
        {
            var product = await _productRepository.GetAsync(p => p.ColorId == id && !p.IsDeleted);
            return product == null;
        }

    }
}
