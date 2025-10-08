using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Business.Constants;
using Business.Handlers.Products.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Enums;
using Core.Utilities.Results;
using DataAccess.Abstract;
using MediatR;

namespace Business.Handlers.Products.Commands
{
    public class UpdateProductCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ColorId { get; set; }
        public ESize Size { get; set; }

        public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, IResult>
        {
            private readonly IProductRepository _productRepository;

            public UpdateProductCommandHandler(IProductRepository productRepository)
            {
                _productRepository = productRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(UpdateProductValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
            {
                var productToUpdate = await _productRepository.GetAsync(p => p.Id == request.Id);

                if (productToUpdate == null)
                {
                    return new ErrorResult(Messages.ProductNotFound);
                }

                productToUpdate.Name = request.Name;
                productToUpdate.ColorId = request.ColorId;
                productToUpdate.Size = request.Size;

                _productRepository.Update(productToUpdate);
                await _productRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

