using System;
using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Business.Constants;
using Business.Handlers.Orders.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;

namespace Business.Handlers.Orders.Commands
{
    public class CreateOrderCommand : IRequest<IResult>
    {
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string OrderNumber { get; set; }

        public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, IResult>
        {
            private readonly IOrderRepository _orderRepository;
            private readonly IWarehouseRepository _warehouseRepository;

            public CreateOrderCommandHandler(IOrderRepository orderRepository, IWarehouseRepository warehouseRepository)
            {
                _orderRepository = orderRepository;
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(CreateOrderValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
            {
                var order = new Order
                {
                    CustomerId = request.CustomerId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    OrderNumber = request.OrderNumber ?? Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                    OrderDate = DateTime.UtcNow
                };

                _orderRepository.Add(order);

                // Update warehouse stock
                var warehouse = await _warehouseRepository.GetAsync(w => w.ProductId == request.ProductId);
                if (warehouse != null)
                {
                    warehouse.Quantity -= request.Quantity;
                    _warehouseRepository.Update(warehouse);
                }

                await _orderRepository.SaveChangesAsync();
                return new SuccessResult(Messages.OrderCreatedSuccessfully);
            }
        }
    }
}

