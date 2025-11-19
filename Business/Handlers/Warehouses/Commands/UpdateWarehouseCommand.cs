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
using MediatR;
using Org.BouncyCastle.Ocsp;

namespace Business.Handlers.Warehouses.Commands
{
    public class UpdateWarehouseCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public bool IsAvailableForSale { get; set; }

        public class UpdateWarehouseCommandHandler : IRequestHandler<UpdateWarehouseCommand, IResult>
        {
            private readonly IWarehouseRepository _warehouseRepository;

            public UpdateWarehouseCommandHandler(IWarehouseRepository warehouseRepository)
            {
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(UpdateWarehouseValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(UpdateWarehouseCommand request, CancellationToken cancellationToken)
            {
                var warehouse = await _warehouseRepository.GetAsync(w => w.Id == request.Id);

                if (warehouse == null)
                    return new ErrorResult(Messages.WarehouseNotFound);
                
                warehouse.Quantity = request.Quantity;
                warehouse.IsAvailableForSale = request.IsAvailableForSale;

                _warehouseRepository.Update(warehouse);
                await _warehouseRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

