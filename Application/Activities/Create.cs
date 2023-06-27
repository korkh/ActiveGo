using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Storage;


namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                var attendee = new ActivityAttendee
                {
                    Activity = request.Activity,
                    AppUser = user,
                    IsHost = true,
                };

                request.Activity.Attendees.Add(attendee);  //add new created attendee

                _context.Activities.Add(request.Activity); //Add used because we are adding activity in memory. We are not touching database at this point. No need AddAsync
                // await _context.SaveChangesAsync();
                // //Unit it's just an object that mediator provides (without any value), but it tells to API that request is finished. Therefore we need to complete by returning something in our case it's Unit.Value, but in reality it equivalent to nothing.
                // return Unit.Value;
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Falied to create activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}