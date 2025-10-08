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

namespace Business.Handlers.Warehouses.Commands
{
    public class DeleteWarehouseCommand : IRequest<IResult>
    {
        public int Id { get; set; }

        public class DeleteWarehouseCommandHandler : IRequestHandler<DeleteWarehouseCommand, IResult>
        {
            private readonly IWarehouseRepository _warehouseRepository;

            public DeleteWarehouseCommandHandler(IWarehouseRepository warehouseRepository)
            {
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(DeleteWarehouseValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(DeleteWarehouseCommand request, CancellationToken cancellationToken)
            {
                var warehouseToDelete = await _warehouseRepository.GetAsync(w => w.Id == request.Id);

                if (warehouseToDelete == null)
                {
                    return new ErrorResult(Messages.WarehouseNotFound);
                }

                // Soft delete
                warehouseToDelete.IsDeleted = true;
                _warehouseRepository.Update(warehouseToDelete);
                await _warehouseRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Deleted);
            }
        }
    }
}

