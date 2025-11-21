using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Business.Handlers.Orders.Commands;
using Business.Handlers.Orders.Queries;
using Entities.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    /// <summary>
    /// Orders Controller - Handles order management operations
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrator,CustomerRepresentative,User")]
    public class OrdersController : BaseApiController
    {
        /// <summary>
        /// List all orders
        /// </summary>
        /// <remarks>Returns all orders with customer and product details</remarks>
        /// <return>Orders List</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OrderDetailDto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetOrdersQuery()));
        }

        /// <summary>
        /// Get order by ID
        /// </summary>
        /// <remarks>Returns order details by ID</remarks>
        /// <param name="id">Order ID</param>
        /// <return>Order Details</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OrderDetailDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetOrderQuery { Id = id }));
        }

        /// <summary>
        /// Create new order
        /// </summary>
        /// <remarks>Creates a new order. Requires CustomerRepresentative role.</remarks>
        /// <param name="createOrder">Order creation data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Order created successfully</response>
        /// <response code="400">Bad Request - Validation errors or insufficient stock</response>
        [Authorize(Roles = "CustomerRepresentative")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateOrderCommand createOrder)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(createOrder));
        }

        /// <summary>
        /// Update existing order
        /// </summary>
        /// <remarks>Updates an existing order. Requires CustomerRepresentative role.</remarks>
        /// <param name="updateOrder">Order update data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Order updated successfully</response>
        /// <response code="400">Bad Request - Validation errors or insufficient stock</response>
        [Authorize(Roles = "CustomerRepresentative")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateOrderCommand updateOrder)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(updateOrder));
        }

        /// <summary>
        /// Delete order
        /// </summary>
        /// <remarks>Soft deletes an order and restores warehouse stock. Requires CustomerRepresentative role.</remarks>
        /// <param name="id">Order ID</param>
        /// <returns>Success message</returns>
        /// <response code="200">Order deleted successfully</response>
        /// <response code="400">Bad Request</response>
        [Authorize(Roles = "CustomerRepresentative")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(new DeleteOrderCommand { Id = id }));
        }
    }
}

