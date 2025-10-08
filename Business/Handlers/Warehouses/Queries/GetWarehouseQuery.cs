using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Logging;
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
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<WarehouseItemDto>> Handle(GetWarehouseQuery request, CancellationToken cancellationToken)
            {
                var warehouseReport = await _warehouseRepository.GetWarehouseReportAsync();
                var warehouse = warehouseReport.Items.FirstOrDefault(w => w.ProductId == request.ProductId);
                
                if (warehouse == null)
                {
                    return new ErrorDataResult<WarehouseItemDto>(Business.Constants.Messages.WarehouseNotFound);
                }

                return new SuccessDataResult<WarehouseItemDto>(warehouse);
            }
        }
    }
}

