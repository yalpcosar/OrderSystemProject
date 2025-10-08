using Business.Handlers.Orders.Commands;
using DataAccess.Abstract;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Orders.ValidationRules
{
    public class DeleteOrderValidator : AbstractValidator<DeleteOrderCommand>
    {
        private readonly IOrderRepository _orderRepository;

        public DeleteOrderValidator(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Sipariş ID zorunludur")
                .MustAsync(OrderExists)
                .WithMessage("Sipariş bulunamadı");
        }

        private async Task<bool> OrderExists(int orderId, CancellationToken cancellation)
        {
            var order = await _orderRepository.GetAsync(o => o.Id == orderId && !o.IsDeleted);
            return order != null;
        }
    }
}

