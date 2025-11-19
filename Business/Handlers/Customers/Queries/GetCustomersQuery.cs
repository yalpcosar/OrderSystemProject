using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Performance;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;

namespace Business.Handlers.Customers.Queries
{
    public class GetCustomersQuery : IRequest<IDataResult<IEnumerable<Customer>>>
    {
        public class GetCustomersQueryHandler : IRequestHandler<GetCustomersQuery, IDataResult<IEnumerable<Customer>>>
        {
            private readonly ICustomerRepository _customerRepository;

            public GetCustomersQueryHandler(ICustomerRepository customerRepository)
            {
                _customerRepository = customerRepository;
            }

            [SecuredOperation(Priority = 1)]
            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<IEnumerable<Customer>>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
            {
                var customers = await _customerRepository.GetListAsync(c => c.IsDeleted == false);
                return new SuccessDataResult<IEnumerable<Customer>>(customers);
            }
        }
    }
}
