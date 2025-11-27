using Business.Handlers.Customers.Commands;
using FluentValidation;

namespace Business.Handlers.Customers.ValidationRules
{
    public class UpdateCustomerValidator : AbstractValidator<UpdateCustomerCommand>
    {
        public UpdateCustomerValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.CustomerName).NotEmpty().MaximumLength(150);
            RuleFor(x => x.CustomerCode).NotEmpty().MaximumLength(11).MinimumLength(11);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.PhoneNumber).MaximumLength(20);
            RuleFor(x => x.Address).MaximumLength(500);
        }
    }
}
