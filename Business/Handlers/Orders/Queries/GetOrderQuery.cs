using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;
using MediatR;
using System.Linq;

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
                var orders = await _orderRepository.GetOrdersWithDetailsAsync();
                var order = orders.FirstOrDefault(o => o.Id == request.Id);
                
                if (order == null)
                {
                    return new ErrorDataResult<OrderDetailDto>(Business.Constants.Messages.OrderNotFound);
                }

                return new SuccessDataResult<OrderDetailDto>(order);
            }
        }
    }
}

