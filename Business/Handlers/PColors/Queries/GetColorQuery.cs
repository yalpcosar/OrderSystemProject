using Business.BusinessAspects;
using Business.Constants;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Drawing;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.PColors.Queries
{
    public class GetColorQuery : IRequest<IDataResult<PColor>>
    {
        public int Id { get; set; }

        public class GetColorQueryHandler : IRequestHandler<GetColorQuery, IDataResult<PColor>>
        {
            private readonly IColorRepository _colorRepository;

            public GetColorQueryHandler(IColorRepository colorRepository)
            {
                _colorRepository = colorRepository;
            }

            [SecuredOperation(Priority = 1)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<PColor>> Handle(GetColorQuery request, CancellationToken cancellationToken)
            {
                var color = await _colorRepository.GetAsync(c => c.Id == request.Id && !c.IsDeleted);
                return color == null
                    ? new ErrorDataResult<PColor>(Messages.NotFound)
                    : new SuccessDataResult<PColor>(color);
            }
        }
    }
}
