using Business.Handlers.Customers.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Customers.ValidationRules
{
    public class CreateCustomerValidator : AbstractValidator<CreateCustomerCommand>
    {
        private readonly ICustomerRepository _customerRepository;

        public CreateCustomerValidator(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;

            RuleFor(x => x.CustomerName)
                .NotEmpty().WithMessage("Müşteri adı zorunludur")
                .MaximumLength(100).WithMessage("Müşteri adı 100 karakteri geçemez");

            RuleFor(x => x.CustomerCode)
                .NotEmpty().WithMessage("Müşteri kodu zorunludur")
                .Length(5, 20).WithMessage("Müşteri kodu 5-20 karakter arasında olmalıdır")
                .Matches(@"^[A-Z0-9\-]+$").WithMessage("Müşteri kodu sadece büyük harf, rakam ve tire içerebilir")
                .MustAsync(BeUniqueCustomerCode)
                .WithMessage("Bu müşteri kodu zaten kullanılıyor");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Telefon numarası zorunludur")
                .Matches(@"^[\d\s\+\-\(\)]+$").WithMessage("Geçersiz telefon numarası formatı")
                .MaximumLength(20).WithMessage("Telefon numarası 20 karakteri geçemez");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("E-posta zorunludur")
                .EmailAddress().WithMessage("Geçersiz e-posta formatı")
                .MaximumLength(100).WithMessage("E-posta 100 karakteri geçemez")
                .MustAsync(BeUniqueEmail)
                .WithMessage("Bu e-posta adresi zaten kayıtlı");

            RuleFor(x => x.Address)
                .MaximumLength(500).WithMessage("Adres 500 karakteri geçemez");
        }

        private async Task<bool> BeUniqueCustomerCode(string code, CancellationToken cancellation)
        {
            var exists = await _customerRepository.GetAsync(c => c.CustomerCode == code && !c.IsDeleted);
            return exists == null;
        }

        private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellation)
        {
            var exists = await _customerRepository.GetAsync(c => c.Email == email && !c.IsDeleted);
            return exists == null;
        }
    }
}
