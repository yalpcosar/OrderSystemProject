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
    public class UpdateColorValidator : AbstractValidator<UpdateColorCommand>
    {
        private readonly IColorRepository _colorRepository;

        public UpdateColorValidator(IColorRepository colorRepository)
        {
            _colorRepository = colorRepository;

            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Geçersiz renk ID");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Renk adı zorunludur")
                .MaximumLength(50).WithMessage("Renk adı 50 karakteri geçemez")
                .MustAsync(BeUniqueColorName)
                .WithMessage("Bu renk adı zaten kullanılıyor");

            RuleFor(x => x.HexCode)
                .Matches(@"^#[0-9A-Fa-f]{6}$")
                .When(x => !string.IsNullOrEmpty(x.HexCode))
                .WithMessage("Hex kodu #RRGGBB formatında olmalıdır");
        }

        private async Task<bool> BeUniqueColorName(UpdateColorCommand command, string name, CancellationToken cancellation)
        {
            var exists = await _colorRepository.GetAsync(c => c.Name == name && c.Id != command.Id && !c.IsDeleted);
            return exists == null;
        }

    }
}
