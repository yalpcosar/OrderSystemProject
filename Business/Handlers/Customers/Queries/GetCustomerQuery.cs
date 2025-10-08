using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;

namespace Business.Handlers.Customers.Queries
{
    public class GetCustomerQuery : IRequest<IDataResult<Customer>>
    {
        public int Id { get; set; }

        public class GetCustomerQueryHandler : IRequestHandler<GetCustomerQuery, IDataResult<Customer>>
        {
            private readonly ICustomerRepository _customerRepository;

            public GetCustomerQueryHandler(ICustomerRepository customerRepository)
            {
                _customerRepository = customerRepository;
            }

            [SecuredOperation(Priority = 1)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<Customer>> Handle(GetCustomerQuery request, CancellationToken cancellationToken)
            {
                var customer = await _customerRepository.GetAsync(c => c.Id == request.Id && !c.IsDeleted);
                
                if (customer == null)
                {
                    return new ErrorDataResult<Customer>(Business.Constants.Messages.CustomerNotFound);
                }

                return new SuccessDataResult<Customer>(customer);
            }
        }
    }
}
