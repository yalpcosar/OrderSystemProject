using System.Threading.Tasks;
using Business.Handlers.Warehouses.Commands;
using Business.Handlers.Warehouses.Queries;
using Entities.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    /// <summary>
    /// Warehouse Controller - Handles warehouse and inventory management operations
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class WarehouseController : BaseApiController
    {
        /// <summary>
        /// Get complete warehouse report
        /// </summary>
        /// <remarks>Returns comprehensive warehouse report with all products and stock levels. All authenticated users can access.</remarks>
        /// <return>Warehouse Report</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WarehouseReportDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet("report")]
        public async Task<IActionResult> GetWarehouseReport()
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetWarehousesQuery()));
        }

        /// <summary>
        /// Check product availability
        /// </summary>
        /// <remarks>Checks if a product has sufficient stock available. All authenticated users can access.</remarks>
        /// <param name="productId">Product ID</param>
        /// <param name="requestedQuantity">Requested quantity (optional, defaults to 1)</param>
        /// <return>Availability status</return>
        /// <response code="200">Success with availability information</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(object))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet("check-availability")]
        public async Task<IActionResult> CheckAvailability([FromQuery] int productId, [FromQuery] int requestedQuantity = 1)
        {
            var warehouse = await Mediator.Send(new GetWarehouseQuery { ProductId = productId });
            
            if (!warehouse.Success)
            {
                return BadRequest(new { available = false, message = warehouse.Message });
            }

            var isAvailable = warehouse.Data.IsAvailableForSale && warehouse.Data.Quantity >= requestedQuantity;
            
            return Ok(new 
            { 
                available = isAvailable, 
                currentStock = warehouse.Data.Quantity,
                requestedQuantity = requestedQuantity,
                productId = productId,
                isAvailableForSale = warehouse.Data.IsAvailableForSale
            });
        }

        /// <summary>
        /// Get warehouse entry by product ID
        /// </summary>
        /// <remarks>Returns warehouse details for a specific product. All authenticated users can access.</remarks>
        /// <param name="productId">Product ID</param>
        /// <return>Warehouse Details</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WarehouseItemDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet("{productId}")]
        public async Task<IActionResult> GetByProductId(int productId)
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetWarehouseQuery { ProductId = productId }));
        }

        /// <summary>
        /// Update warehouse entry
        /// </summary>
        /// <remarks>Updates warehouse stock levels and availability. Requires Admin or CustomerRepresentative role.</remarks>
        /// <param name="updateWarehouse">Warehouse update data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Warehouse entry updated successfully</response>
        /// <response code="400">Bad Request - Validation errors or negative quantity</response>
        [Authorize(Roles = "Administrator,CustomerRepresentative")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateWarehouseCommand updateWarehouse)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(updateWarehouse));
        }
    }
}

