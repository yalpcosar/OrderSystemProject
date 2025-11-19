using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Business.BusinessAspects;
using Business.Constants;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;
using MediatR;

namespace Business.Handlers.Products.Queries
{
    public class GetProductQuery : IRequest<IDataResult<ProductDetailDto>>
    {
        public int Id { get; set; }

        public class GetProductQueryHandler : IRequestHandler<GetProductQuery, IDataResult<ProductDetailDto>>
        {
            private readonly IProductRepository _productRepository;

            public GetProductQueryHandler(IProductRepository productRepository)
            {
                _productRepository = productRepository;
            }

            [SecuredOperation(Priority = 1)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<ProductDetailDto>> Handle(GetProductQuery request, CancellationToken cancellationToken)
            {
                var products = await _productRepository.GetProductDetailAsync();
                var product = products.FirstOrDefault(p => p.ProductId == request.Id);
                
                if (product == null)
                    return new ErrorDataResult<ProductDetailDto>(Messages.ProductNotFound);
                
                return new SuccessDataResult<ProductDetailDto>(product);
            }
        }
    }
}

