using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Business.Constants;
using Business.Handlers.Customers.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;

namespace Business.Handlers.Customers.Commands
{
    public class CreateCustomerCommand : IRequest<IResult>
    {
        public string CustomerName { get; set; }
        public string CustomerCode { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        public class CreateCustomerCommandHandler : IRequestHandler<CreateCustomerCommand, IResult>
        {
            private readonly ICustomerRepository _customerRepository;

            public CreateCustomerCommandHandler(ICustomerRepository customerRepository)
            {
                _customerRepository = customerRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(CreateCustomerValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
            {
                var customerExists = await _customerRepository.GetAsync(c => c.CustomerCode == request.CustomerCode && c.IsDeleted == false);
                if (customerExists != null)
                    return new ErrorResult(Messages.CustomerCodeAlreadyExists);
                    
                var customer = new Customer
                {
                    CustomerName = request.CustomerName,
                    CustomerCode = request.CustomerCode,
                    Address = request.Address,
                    PhoneNumber = request.PhoneNumber,
                    Email = request.Email
                };

                _customerRepository.Add(customer);
                await _customerRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Added);
            }
        }
    }
}

