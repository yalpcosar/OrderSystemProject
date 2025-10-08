using Business.Handlers.Customers.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Customers.ValidationRules
{
    public class DeleteCustomerValidator : AbstractValidator<DeleteCustomerCommand>
    {
        private readonly ICustomerRepository _customerRepository;

        public DeleteCustomerValidator(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Müşteri ID zorunludur")
                .MustAsync(CustomerExists)
                .WithMessage("Müşteri bulunamadı");
        }

        private async Task<bool> CustomerExists(int customerId, CancellationToken cancellation)
        {
            var customer = await _customerRepository.GetAsync(c => c.Id == customerId && !c.IsDeleted);
            return customer != null;
        }
    }
}
