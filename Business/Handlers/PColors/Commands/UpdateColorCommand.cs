using Business.BusinessAspects;
using Business.Constants;
using Business.Handlers.PColors.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.PColors.Commands
{
    public class UpdateColorCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string HexCode { get; set; }

        public class UpdateColorCommandHandler : IRequestHandler<UpdateColorCommand, IResult>
        {
            private readonly IPColorRepository _colorRepository;

            public UpdateColorCommandHandler(IPColorRepository colorRepository)
            {
                _colorRepository = colorRepository;
            }

            [SecuredOperation(Priority = 1)]
            [ValidationAspect(typeof(UpdateColorValidator), Priority = 2)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(UpdateColorCommand request, CancellationToken cancellationToken)
            {
                var color = await _colorRepository.GetAsync(c => c.Id == request.Id);
                if (color == null)
                    return new ErrorResult(Messages.NotFound);

                color.Name = request.Name;
                color.HexCode = request.HexCode;

                _colorRepository.Update(color);
                await _colorRepository.SaveChangesAsync();

                return new SuccessResult(Messages.Updated);
            }
        }
    }
}
