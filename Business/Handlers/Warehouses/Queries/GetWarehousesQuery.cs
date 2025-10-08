using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
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
    public class GetWarehousesQuery : IRequest<IDataResult<WarehouseReportDto>>
    {
        public class GetWarehousesQueryHandler : IRequestHandler<GetWarehousesQuery, IDataResult<WarehouseReportDto>>
        {
            private readonly IWarehouseRepository _warehouseRepository;

            public GetWarehousesQueryHandler(IWarehouseRepository warehouseRepository)
            {
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<WarehouseReportDto>> Handle(GetWarehousesQuery request, CancellationToken cancellationToken)
            {
                var warehouseReport = await _warehouseRepository.GetWarehouseReportAsync();
                return new SuccessDataResult<WarehouseReportDto>(warehouseReport);
            }
        }
    }
}

