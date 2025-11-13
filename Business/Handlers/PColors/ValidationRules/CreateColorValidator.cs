using Business.Handlers.PColors.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.PColors.ValidationRules
{
    public class CreateColorValidator : AbstractValidator<CreateColorCommand>
    {
        private readonly IPColorRepository _colorRepository;

        public CreateColorValidator(IPColorRepository colorRepository)
        {
            _colorRepository = colorRepository;

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Renk adı zorunludur")
                .MaximumLength(50).WithMessage("Renk adı 50 karakteri geçemez")
                .MustAsync(BeUniqueColorName)
                .WithMessage("Bu renk adı zaten kullanılıyor");

            RuleFor(x => x.HexCode)
                .Matches(@"^#[0-9A-Fa-f]{6}$")
                .When(x => !string.IsNullOrEmpty(x.HexCode))
                .WithMessage("Hex kodu #RRGGBB formatında olmalıdır (örn: #FF0000)");
        }

        private async Task<bool> BeUniqueColorName(CreateColorCommand command, string name, CancellationToken cancellation)
        {
            var exists = await _colorRepository.GetAsync(c => c.Name == name && !c.IsDeleted);
            return exists == null;
        }
    }
}
