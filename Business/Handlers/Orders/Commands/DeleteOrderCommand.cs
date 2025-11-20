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
using MediatR;

namespace Business.Handlers.Orders.Commands
{
    public class DeleteOrderCommand : IRequest<IResult>
    {
        public int Id { get; set; }

        public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand, IResult>
        {
            private readonly IOrderRepository _orderRepository;
            private readonly IWarehouseRepository _warehouseRepository;

            public DeleteOrderCommandHandler(IOrderRepository orderRepository, IWarehouseRepository warehouseRepository)
            {
                _orderRepository = orderRepository;
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(DeleteOrderValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            [TransactionScopeAspect]
            public async Task<IResult> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
            {
                var orderToDelete = await _orderRepository.GetAsync(o => o.Id == request.Id && o.IsDeleted == false);

                if (orderToDelete == null)
                {
                    return new ErrorResult(Messages.OrderNotFound);
                }

                var warehouse = await _warehouseRepository.GetAsync(w => w.ProductId == orderToDelete.ProductId);
                if (warehouse != null)
                {
                    warehouse.Quantity += orderToDelete.Quantity;
                    _warehouseRepository.Update(warehouse);
                }

                // Soft delete
                orderToDelete.IsDeleted = true;
                _orderRepository.Update(orderToDelete);
                await _orderRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Deleted);
            }
        }
    }
}

