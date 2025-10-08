using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Performance;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;
using MediatR;

namespace Business.Handlers.Orders.Queries
{
    public class GetOrdersQuery : IRequest<IDataResult<IEnumerable<OrderDetailDto>>>
    {
        public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, IDataResult<IEnumerable<OrderDetailDto>>>
        {
            private readonly IOrderRepository _orderRepository;

            public GetOrdersQueryHandler(IOrderRepository orderRepository)
            {
                _orderRepository = orderRepository;
            }

            [SecuredOperation(Priority = 1)]
            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<IEnumerable<OrderDetailDto>>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
            {
                var orders = await _orderRepository.GetOrdersWithDetailsAsync();
                return new SuccessDataResult<IEnumerable<OrderDetailDto>>(orders);
            }
        }
    }
}

