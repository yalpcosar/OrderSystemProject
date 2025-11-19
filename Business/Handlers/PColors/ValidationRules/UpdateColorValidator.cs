using Business.Handlers.PColors.Commands;
using DataAccess.Abstract;
using FluentValidation;

namespace Business.Handlers.PColors.ValidationRules
{
    public class UpdateColorValidator : AbstractValidator<UpdateColorCommand>
    {
        public UpdateColorValidator()
        {
            RuleFor(p => p.Id).NotEmpty();
            RuleFor(p => p.Name).NotEmpty().WithMessage("Color name is required");
            RuleFor(p => p.Name).MaximumLength(50).WithMessage("Color name cannot exceed 50 characters");
            RuleFor(p => p.HexCode).MaximumLength(7).WithMessage("Hex Code cannot exceed 7 characters");
        }
    }
}
