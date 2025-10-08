using System.Collections.Generic;
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

namespace Business.Handlers.Products.Queries
{
    public class GetProductsQuery : IRequest<IDataResult<IEnumerable<ProductWithStockDto>>>
    {
        public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, IDataResult<IEnumerable<ProductWithStockDto>>>
        {
            private readonly IProductRepository _productRepository;

            public GetProductsQueryHandler(IProductRepository productRepository)
            {
                _productRepository = productRepository;
            }

            [SecuredOperation(Priority = 1)]
            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<IEnumerable<ProductWithStockDto>>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
            {
                var products = await _productRepository.GetProductsWithStockAsync();
                return new SuccessDataResult<IEnumerable<ProductWithStockDto>>(products);
            }
        }
    }
}

