using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Business.Constants;
using Business.Handlers.Products.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using MediatR;

namespace Business.Handlers.Products.Commands
{
    public class DeleteProductCommand : IRequest<IResult>
    {
        public int Id { get; set; }

        public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, IResult>
        {
            private readonly IProductRepository _productRepository;

            public DeleteProductCommandHandler(IProductRepository productRepository)
            {
                _productRepository = productRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(DeleteProductValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
            {
                var productToDelete = await _productRepository.GetAsync(p => p.Id == request.Id);

                if (productToDelete == null)
                {
                    return new ErrorResult(Messages.ProductNotFound);
                }

                // Soft delete
                productToDelete.IsDeleted = true;
                _productRepository.Update(productToDelete);
                await _productRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Deleted);
            }
        }
    }
}

