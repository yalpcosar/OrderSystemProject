using System.Collections.Generic;
using System.Threading.Tasks;
using Business.Handlers.Customers.Commands;
using Business.Handlers.Customers.Queries;
using Entities.Concrete;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    /// <summary>
    /// Customers Controller - Handles customer management operations
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrator,CustomerRepresentative")]
    public class CustomersController : BaseApiController
    {
        /// <summary>
        /// List all customers
        /// </summary>
        /// <remarks>Returns all customers</remarks>
        /// <return>Customers List</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Customer>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetCustomersQuery()));
        }

        /// <summary>
        /// Get customer by ID
        /// </summary>
        /// <remarks>Returns customer details by ID</remarks>
        /// <param name="id">Customer ID</param>
        /// <return>Customer Details</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Customer))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetCustomerQuery { Id = id }));
        }

        /// <summary>
        /// Create new customer
        /// </summary>
        /// <remarks>Creates a new customer with unique email and customer code validation</remarks>
        /// <param name="createCustomer">Customer creation data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Customer created successfully</response>
        /// <response code="400">Bad Request - Validation errors or duplicate email/code</response>
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateCustomerCommand createCustomer)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(createCustomer));
        }

        /// <summary>
        /// Update existing customer
        /// </summary>
        /// <remarks>Updates an existing customer with unique email and customer code validation</remarks>
        /// <param name="updateCustomer">Customer update data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Customer updated successfully</response>
        /// <response code="400">Bad Request - Validation errors or duplicate email/code</response>
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateCustomerCommand updateCustomer)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(updateCustomer));
        }

        /// <summary>
        /// Delete customer
        /// </summary>
        /// <remarks>Soft deletes a customer</remarks>
        /// <param name="id">Customer ID</param>
        /// <returns>Success message</returns>
        /// <response code="200">Customer deleted successfully</response>
        /// <response code="400">Bad Request</response>
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(new DeleteCustomerCommand { Id = id }));
        }
    }
}

