using Business.Handlers.PColors.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.PColors.ValidationRules
{
    public class DeleteColorValidator : AbstractValidator<DeleteColorCommand>
    {
        public DeleteColorValidator()
        {
            RuleFor(p => p.Id).NotEmpty();
        }

    }
}
