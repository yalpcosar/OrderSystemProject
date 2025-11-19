using Business.Handlers.Customers.Commands;
using DataAccess.Abstract;
using FluentValidation;

namespace Business.Handlers.Customers.ValidationRules
{
    public class CreateCustomerValidator : AbstractValidator<CreateCustomerCommand>
    {
        public CreateCustomerValidator()
        {
            RuleFor(x => x.CustomerName).NotEmpty().MaximumLength(150);
            RuleFor(x => x.CustomerCode).NotEmpty().MaximumLength(11); // Entityde otomatik atanan customer code 11 haneli.
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.PhoneNumber).MaximumLength(20);
            RuleFor(x => x.Address).MaximumLength(500);
        }
    }
}
