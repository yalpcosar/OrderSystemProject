using Business.Handlers.Products.Commands;
using FluentValidation;

namespace Business.Handlers.Products.ValidationRules
{
    public class CreateProductValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.PColorId).NotEmpty();
            RuleFor(x => x.Size).IsInEnum();
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Stock quantity cannot be less than 0");
        }
    }
}
