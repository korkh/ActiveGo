using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {

        [HttpGet] //api/activities
        public async Task<IActionResult> GetActivities()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")] //api/activities/asdasdasdd
        public async Task<IActionResult> GetActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        //in that method we are returning nothing. And when we are using IActionRequest it gives us access to the http response types which returns Ok(), return back request, return "Not found" but we don't need to specify the type we returning here
        [HttpPost()]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
            //Mediator is smart enough to recognize to look inside the body of the request (Activity activity) to get that object and compare the properties avalable inside activity and if they match it that activity you want to pass as parameter and it will look inside the body and going get it.
        }

        //Only host can edit and delete an activity
        //Check IdentityServiceExtensions and IsHostRequirement
        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        //Only host can edit and delete an activity
        //Check IdentityServiceExtensions and IsHostRequirement
        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id })); //{Id = id} - object initializer
        }

        //Method to Update Attendance
        //Each time sending request it will activate command UpdateAttendance
        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id })); //{Id = id} - object initializer
        }
    }
}