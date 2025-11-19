using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Business.Constants;
using Business.Handlers.Products.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Transaction;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Business.Handlers.Products.Commands
{
    public class DeleteProductCommand : IRequest<IResult>
    {
        public int Id { get; set; }

        public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, IResult>
        {
            private readonly IProductRepository _productRepository;
            private readonly IWarehouseRepository _warehouseRepository;

            public DeleteProductCommandHandler(IProductRepository productRepository, IWarehouseRepository warehouseRepository)
            {
                _productRepository = productRepository;
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(DeleteProductValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            [TransactionScopeAspect]
            public async Task<IResult> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
            {
                var product = await _productRepository.Query()
                            .Include(p => p.Warehouse)
                            .FirstOrDefaultAsync(p => p.Id == request.Id);

                if (product == null)
                    return new ErrorResult(Messages.ProductNotFound);

                product.IsDeleted = true;
                _productRepository.Update(product);

                if(product.Warehouse == null)
                {
                    product.Warehouse.IsDeleted = true;
                    _warehouseRepository.Update(product.Warehouse);
                }

                await _productRepository.SaveChangesAsync();
                await _warehouseRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Deleted);
            }
        }
    }
}

