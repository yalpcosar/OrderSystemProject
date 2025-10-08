using Business.Handlers.Warehouses.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Warehouses.ValidationRules
{
    public class DeleteWarehouseValidator : AbstractValidator<DeleteWarehouseCommand>
    {
        private readonly IWarehouseRepository _warehouseRepository;

        public DeleteWarehouseValidator(IWarehouseRepository warehouseRepository)
        {
            _warehouseRepository = warehouseRepository;

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Depo ID zorunludur")
                .MustAsync(WarehouseExists)
                .WithMessage("Depo bulunamadı");
        }

        private async Task<bool> WarehouseExists(int warehouseId, CancellationToken cancellation)
        {
            var warehouse = await _warehouseRepository.GetAsync(w => w.Id == warehouseId && !w.IsDeleted);
            return warehouse != null;
        }
    }
}

