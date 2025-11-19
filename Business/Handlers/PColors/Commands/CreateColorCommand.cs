using Business.BusinessAspects;
using Business.Constants;
using Business.Handlers.PColors.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.PColors.Commands
{
    public class CreateColorCommand : IRequest<IResult>
    {
        public string Name { get; set; }
        public string HexCode { get; set; }

        public class CreateColorCommandHandler : IRequestHandler<CreateColorCommand, IResult>
        {
            private readonly IPColorRepository _colorRepository;


            public CreateColorCommandHandler(IPColorRepository colorRepository)
            {
                _colorRepository = colorRepository;

            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(CreateColorValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(CreateColorCommand request, CancellationToken cancellationToken)
            {
                var color = new PColor
                {
                    Name = request.Name,
                    HexCode = request.HexCode
                };

                _colorRepository.Add(color);
                await _colorRepository.SaveChangesAsync();

                return new SuccessResult(Messages.Added);
            }
        }
    }
}
