using System.Collections.Generic;
using System.Threading.Tasks;
using Business.Handlers.PColors.Commands;
using Business.Handlers.PColors.Queries;
using Entities.Concrete;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    /// <summary>
    /// Colors Controller - Handles color management operations
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class PColorsController : BaseApiController
    {
        /// <summary>
        /// List all colors
        /// </summary>
        /// <remarks>Returns all colors. All authenticated users can access.</remarks>
        /// <return>Colors List</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<PColor>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetColorsQuery()));
        }

        /// <summary>
        /// Get color by ID
        /// </summary>
        /// <remarks>Returns color details by ID. All authenticated users can access.</remarks>
        /// <param name="id">Color ID</param>
        /// <return>Color Details</return>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PColor))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return GetResponseOnlyResultData(await Mediator.Send(new GetColorQuery { Id = id }));
        }

        /// <summary>
        /// Create new color
        /// </summary>
        /// <remarks>Creates a new color with unique name validation and optional hex code. Requires Admin or CustomerRepresentative role.</remarks>
        /// <param name="createColor">Color creation data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Color created successfully</response>
        /// <response code="400">Bad Request - Validation errors or duplicate name</response>
        [Authorize(Roles = "Administrator,CustomerRepresentative")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateColorCommand createColor)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(createColor));
        }

        /// <summary>
        /// Update existing color
        /// </summary>
        /// <remarks>Updates an existing color with unique name validation. Requires Admin or CustomerRepresentative role.</remarks>
        /// <param name="updateColor">Color update data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Color updated successfully</response>
        /// <response code="400">Bad Request - Validation errors or duplicate name</response>
        [Authorize(Roles = "Administrator,CustomerRepresentative")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateColorCommand updateColor)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(updateColor));
        }

        /// <summary>
        /// Delete color
        /// </summary>
        /// <remarks>Soft deletes a color. Prevents deletion if color is used in products. Requires Administrator role only.</remarks>
        /// <param name="id">Color ID</param>
        /// <returns>Success message</returns>
        /// <response code="200">Color deleted successfully</response>
        /// <response code="400">Bad Request - Color not found or used in products</response>
        [Authorize(Roles = "Administrator")]
        [Consumes("application/json")]
        [Produces("application/json", "text/plain")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            return GetResponseOnlyResultMessage(await Mediator.Send(new DeleteColorCommand { Id = id }));
        }
    }
}

