using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Command command) //[FromForm] attribute tels to API controller where to find the file
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id) //[FromForm] attribute tels to API controller where to find the file
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain(string id) //[FromForm] attribute tels to API controller where to find the file
        {
            return HandleResult(await Mediator.Send(new SetMain.Command { Id = id }));
        }
    }
}