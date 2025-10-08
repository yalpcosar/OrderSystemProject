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
using MediatR;

namespace Business.Handlers.Customers.Commands
{
    public class UpdateCustomerCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public string CustomerCode { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, IResult>
        {
            private readonly ICustomerRepository _customerRepository;

            public UpdateCustomerCommandHandler(ICustomerRepository customerRepository)
            {
                _customerRepository = customerRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(UpdateCustomerValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
            {
                var customerToUpdate = await _customerRepository.GetAsync(c => c.Id == request.Id);

                if (customerToUpdate == null)
                {
                    return new ErrorResult(Messages.CustomerNotFound);
                }

                customerToUpdate.CustomerName = request.CustomerName;
                customerToUpdate.CustomerCode = request.CustomerCode;
                customerToUpdate.Address = request.Address;
                customerToUpdate.PhoneNumber = request.PhoneNumber;
                customerToUpdate.Email = request.Email;

                _customerRepository.Update(customerToUpdate);
                await _customerRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}
