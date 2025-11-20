using System.Collections.Generic;
using System.Threading.Tasks;
using Business.Handlers.Products.Commands;
using Business.Handlers.Products.Queries;
using Entities.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    /// <summary>
    /// Products Controller - Handles product management operations
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class ProductsController : BaseApiController
    {
        /// <summary>
        /// List all products with stock information
        /// </summary>
        /// <remarks>Returns all products with warehouse stock details. All authenticated users can access.</remarks>
        /// <return>Products List with Stock</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<ProductDetailDto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetProductsQuery()));
        }

        /// <summary>
        /// Get product by ID with stock information
        /// </summary>
        /// <remarks>Returns product details with stock by ID. All authenticated users can access.</remarks>
        /// <param name="id">Product ID</param>
        /// <return>Product Details with Stock</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProductDetailDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetProductQuery { Id = id }));
        }

        /// <summary>
        /// Create new product
        /// </summary>
        /// <remarks>Creates a new product with Name+Color+Size uniqueness validation and auto-creates warehouse entry. Requires Admin, CustomerRepresentative, or User role.</remarks>
        /// <param name="createProduct">Product creation data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Product created successfully</response>
        /// <response code="400">Bad Request - Validation errors or duplicate product</response>
        [Authorize(Roles = "Administrator,CustomerRepresentative,User")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateProductCommand createProduct)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(createProduct));
        }

        /// <summary>
        /// Update existing product
        /// </summary>
        /// <remarks>Updates an existing product with Name+Color+Size uniqueness validation. Requires Admin, CustomerRepresentative, or User role.</remarks>
        /// <param name="updateProduct">Product update data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Product updated successfully</response>
        /// <response code="400">Bad Request - Validation errors or duplicate product</response>
        [Authorize(Roles = "Administrator,CustomerRepresentative,User")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProductCommand updateProduct)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(updateProduct));
        }

        /// <summary>
        /// Delete product
        /// </summary>
        /// <remarks>Soft deletes a product. Requires Admin, CustomerRepresentative, or User role.</remarks>
        /// <param name="id">Product ID</param>
        /// <returns>Success message</returns>
        /// <response code="200">Product deleted successfully</response>
        /// <response code="400">Bad Request</response>
        [Authorize(Roles = "Administrator,CustomerRepresentative,User")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(new DeleteProductCommand { Id = id }));
        }
    }
}

