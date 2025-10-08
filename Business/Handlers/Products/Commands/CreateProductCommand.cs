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
using Entities.Concrete;
using MediatR;

namespace Business.Handlers.Products.Commands
{
    public class CreateProductCommand : IRequest<IResult>
    {
        public string Name { get; set; }
        public int ColorId { get; set; }
        public ESize Size { get; set; }

        public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, IResult>
        {
            private readonly IProductRepository _productRepository;
            private readonly IWarehouseRepository _warehouseRepository;

            public CreateProductCommandHandler(IProductRepository productRepository, IWarehouseRepository warehouseRepository)
            {
                _productRepository = productRepository;
                _warehouseRepository = warehouseRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(CreateProductValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(CreateProductCommand request, CancellationToken cancellationToken)
            {
                var product = new Product
                {
                    Name = request.Name,
                    ColorId = request.ColorId,
                    Size = request.Size
                };

                _productRepository.Add(product);
                await _productRepository.SaveChangesAsync();

                // Auto-create Warehouse for the new product
                var warehouse = new Warehouse
                {
                    ProductId = product.Id,
                    Quantity = 0,
                    IsAvailableForSale = false
                };

                _warehouseRepository.Add(warehouse);
                await _warehouseRepository.SaveChangesAsync();

                return new SuccessResult(Messages.Added);
            }
        }
    }
}
