using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Business.Constants;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Performance;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;
using MediatR;

namespace Business.Handlers.Warehouses.Queries
{
    public class GetWarehouseQuery : IRequest<IDataResult<WarehouseItemDto>>
    {
        public int ProductId { get; set; }

        public class GetWarehouseQueryHandler : IRequestHandler<GetWarehouseQuery, IDataResult<WarehouseItemDto>>
        {
            private readonly IWarehouseRepository _warehouseRepository;

            public GetWarehouseQueryHandler(IWarehouseRepository warehouseRepository)
            {
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<WarehouseItemDto>> Handle(GetWarehouseQuery request, CancellationToken cancellationToken)
            {
                var warehouse = await _warehouseRepository.GetWarehouseItemByProductIdAsync(request.ProductId);
                
                if (warehouse == null)
                    return new ErrorDataResult<WarehouseItemDto>(Messages.WarehouseNotFound);

                return new SuccessDataResult<WarehouseItemDto>(warehouse);
            }
        }
    }
}

