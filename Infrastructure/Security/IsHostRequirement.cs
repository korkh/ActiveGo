using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Storage;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement //No properties are required
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement> //Implement abstract class from IsHostRequirementHandler
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;

        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier); //More effective to find an activity by it's primary key

            if (userId == null) return Task.CompletedTask;

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var attendee = _dbContext.ActivityAttendees
                .AsNoTracking() //We dont need the entity framework to track attendee in memory
                .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId).Result; //we cannot use await inside because we are using override the Task and we want to have containing activity attendee object

            if (attendee == null) return Task.CompletedTask;

            if (attendee.IsHost) context.Succeed(requirement); //if context Succeed flag is set

            return Task.CompletedTask; //user will be authorized to add and edit the activity
        }
    }
}