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
        public int PColorId { get; set; }
        public ESize Size { get; set; }

        public int Quantity { get; set;}
        public bool IsAvailableForSale { get; set;}

        public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, IResult>
        {
            private readonly IProductRepository _productRepository;

            public CreateProductCommandHandler(IProductRepository productRepository)
            {
                _productRepository = productRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(CreateProductValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(CreateProductCommand request, CancellationToken cancellationToken)
            {
                var productIsExist = await _productRepository.GetAsync(p => p.Name == request.Name);
                if(productIsExist == null)
                    return new ErrorResult(Messages.ProductAlreadyExists);

                var product = new Product
                {
                    Name = request.Name,
                    PColorId = request.PColorId,
                    Size = request.Size,

                    Warehouse = new Warehouse
                    {
                        Quantity = request.Quantity,
                        IsAvailableForSale = true
                    }
                };

                _productRepository.Add(product);
                await _productRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Added);
            }
        }
    }
}
