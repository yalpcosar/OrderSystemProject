using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;
using MediatR;
using Business.Constants;

namespace Business.Handlers.Orders.Queries
{
    public class GetOrderQuery : IRequest<IDataResult<OrderDetailDto>>
    {
        public int Id { get; set; }

        public class GetOrderQueryHandler : IRequestHandler<GetOrderQuery, IDataResult<OrderDetailDto>>
        {
            private readonly IOrderRepository _orderRepository;

            public GetOrderQueryHandler(IOrderRepository orderRepository)
            {
                _orderRepository = orderRepository;
            }

            [SecuredOperation(Priority = 1)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<OrderDetailDto>> Handle(GetOrderQuery request, CancellationToken cancellationToken)
            {
                var order = await _orderRepository.GetOrderDetailsByIdAsync(request.Id);
                if (order == null)
                    return new ErrorDataResult<OrderDetailDto>(Messages.OrderNotFound);
         
                return new SuccessDataResult<OrderDetailDto>(order);
            }
        }
    }
}

