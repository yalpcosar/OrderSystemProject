using Business.Constants;
using Business.Handlers.Warehouses.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Warehouses.ValidationRules
{
    public class UpdateWarehouseValidator : AbstractValidator<UpdateWarehouseCommand>
    {
        public UpdateWarehouseValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0).WithMessage(Messages.WarehouseQuantityCannotBeNegative);
        }
    }
}

