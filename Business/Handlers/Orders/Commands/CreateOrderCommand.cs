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
    public class CreateOrderCommand : IRequest<IResult>
    {
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }


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
            [TransactionScopeAspect]
            public async Task<IResult> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
            {
               var warehouseItem = await _warehouseRepository.GetAsync(w => w.ProductId == request.ProductId && w.IsDeleted == false);

                if (warehouseItem == null)
                    return new ErrorResult(Messages.ProductNotFoundInWarehouse);

                if (!warehouseItem.IsAvailableForSale)
                    return new ErrorResult(Messages.ProductNotReadyForSale);
                
                if (warehouseItem.Quantity < request.Quantity)
                    return new ErrorResult(Messages.ProductQuantityNotEnough);

                warehouseItem.Quantity -= request.Quantity;
                _warehouseRepository.Update(warehouseItem);

                var order = new Order
                {
                    CustomerId = request.CustomerId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    Status = true
                };

                _orderRepository.Add(order);
                await _orderRepository.SaveChangesAsync();
                await _warehouseRepository.SaveChangesAsync();

                return new SuccessResult(Messages.Added);
            }
        }
    }
}

