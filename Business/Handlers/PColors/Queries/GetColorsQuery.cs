using Business.BusinessAspects;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Performance;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.PColors.Queries
{
    public class GetColorsQuery : IRequest<IDataResult<IEnumerable<PColor>>>
    {
        public class GetColorsQueryHandler : IRequestHandler<GetColorsQuery, IDataResult<IEnumerable<PColor>>>
        {
            private readonly IPColorRepository _colorRepository;

            public GetColorsQueryHandler(IPColorRepository colorRepository)
            {
                _colorRepository = colorRepository;
            }

            [SecuredOperation(Priority = 1)]
            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<IEnumerable<PColor>>> Handle(GetColorsQuery request, CancellationToken cancellationToken)
            {
                var colors = await _colorRepository.GetListAsync(c => !c.IsDeleted);
                return new SuccessDataResult<IEnumerable<PColor>>(colors);
            }
        }
    }
}
