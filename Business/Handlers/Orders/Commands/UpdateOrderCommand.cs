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
using MediatR;

namespace Business.Handlers.Orders.Commands
{
    public class UpdateOrderCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string OrderNumber { get; set; }

        public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, IResult>
        {
            private readonly IOrderRepository _orderRepository;
            private readonly IWarehouseRepository _warehouseRepository;

            public UpdateOrderCommandHandler(IOrderRepository orderRepository, IWarehouseRepository warehouseRepository)
            {
                _orderRepository = orderRepository;
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(UpdateOrderValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
            {
                var orderToUpdate = await _orderRepository.GetAsync(o => o.Id == request.Id);

                if (orderToUpdate == null)
                {
                    return new ErrorResult(Messages.OrderNotFound);
                }

                var oldQuantity = orderToUpdate.Quantity;
                var oldProductId = orderToUpdate.ProductId;

                // Restore old warehouse stock
                if (oldProductId == request.ProductId)
                {
                    var warehouse = await _warehouseRepository.GetAsync(w => w.ProductId == oldProductId);
                    if (warehouse != null)
                    {
                        warehouse.Quantity += oldQuantity;
                        warehouse.Quantity -= request.Quantity;
                        _warehouseRepository.Update(warehouse);
                    }
                }
                else
                {
                    // Restore old product stock
                    var oldWarehouse = await _warehouseRepository.GetAsync(w => w.ProductId == oldProductId);
                    if (oldWarehouse != null)
                    {
                        oldWarehouse.Quantity += oldQuantity;
                        _warehouseRepository.Update(oldWarehouse);
                    }

                    // Deduct new product stock
                    var newWarehouse = await _warehouseRepository.GetAsync(w => w.ProductId == request.ProductId);
                    if (newWarehouse != null)
                    {
                        newWarehouse.Quantity -= request.Quantity;
                        _warehouseRepository.Update(newWarehouse);
                    }
                }

                orderToUpdate.CustomerId = request.CustomerId;
                orderToUpdate.ProductId = request.ProductId;
                orderToUpdate.Quantity = request.Quantity;
                orderToUpdate.OrderNumber = request.OrderNumber;

                _orderRepository.Update(orderToUpdate);
                await _orderRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

