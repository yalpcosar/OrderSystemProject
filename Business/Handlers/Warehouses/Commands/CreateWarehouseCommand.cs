using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Business.Constants;
using Business.Handlers.Warehouses.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;

namespace Business.Handlers.Warehouses.Commands
{
    public class CreateWarehouseCommand : IRequest<IResult>
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public bool IsAvailableForSale { get; set; }

        public class CreateWarehouseCommandHandler : IRequestHandler<CreateWarehouseCommand, IResult>
        {
            private readonly IWarehouseRepository _warehouseRepository;

            public CreateWarehouseCommandHandler(IWarehouseRepository warehouseRepository)
            {
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(CreateWarehouseValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(CreateWarehouseCommand request, CancellationToken cancellationToken)
            {
                var warehouse = new Warehouse
                {
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    IsAvailableForSale = request.IsAvailableForSale
                };

                _warehouseRepository.Add(warehouse);
                await _warehouseRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Added);
            }
        }
    }
}

