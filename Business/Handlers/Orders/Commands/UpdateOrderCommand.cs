using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Business.Constants;
using Business.Handlers.Orders.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Transaction;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;

namespace Business.Handlers.Orders.Commands
{
    public class UpdateOrderCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public bool Status { get; set; }

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
            [TransactionScopeAspect]
            public async Task<IResult> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
            {
                var orderUpdate = await _orderRepository.GetAsync(o => o.Id == request.Id && o.IsDeleted == false);
                if (orderUpdate == null)
                    return new ErrorResult(Messages.OrderNotFound);

                var oldWarehouseItem = await _warehouseRepository.GetAsync(w => w.ProductId == orderUpdate.ProductId);
                if (oldWarehouseItem != null)
                {
                    oldWarehouseItem.Quantity += orderUpdate.Quantity;
                    _warehouseRepository.Update(oldWarehouseItem);
                }

                var newWarehouseItem = await _warehouseRepository.GetAsync(w => w.ProductId == request.ProductId && w.IsDeleted == false);
                if (newWarehouseItem == null) return new ErrorResult(Messages.ProductNotFoundInWarehouse);
                if (!newWarehouseItem.IsAvailableForSale) return new ErrorResult(Messages.ProductNotReadyForSale);
                if (newWarehouseItem.Quantity < request.Quantity) return new ErrorResult(Messages.ProductQuantityNotEnough);

                newWarehouseItem.Quantity -= request.Quantity;
                _warehouseRepository.Update(newWarehouseItem);

                orderUpdate.CustomerId = request.CustomerId;
                orderUpdate.ProductId = request.ProductId;
                orderUpdate.Quantity = request.Quantity;
                orderUpdate.Status = request.Status;

                _orderRepository.Update(orderUpdate);
                await _orderRepository.SaveChangesAsync();
                await _warehouseRepository.SaveChangesAsync();

                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

