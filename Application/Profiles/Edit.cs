
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Storage;

namespace Application.Profiles
{
    public class Edit
    {
        //MediatR Command as User's request to edit Profile
        public class Command : IRequest<Result<Unit>>
        {
            //properties, representing the desired changes to the user's profile.
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        //The CommandValidator class is a FluentValidation validator responsible for validating the Command class. In this case, it ensures that the DisplayName property is not empty.
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
            }
        }

        //Handler class is the MediatR command handler responsible for processing the profile editing request.
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            // The DataContext represents the database context, and IUserAccessor is an interface that likely provides access to the currently authenticated user.
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //Retrieve user from database based on the currently authenticated user's username.
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                //updates the user's Bio and DisplayName properties with the values provided in the command, using the null coalescing operator (??) to preserve the existing values if the request does not specify new ones and throw 400 Bad Request  error
                user.Bio = request.Bio ?? user.Bio; //?? checks if request.Bio != null and if not value will be assigned to user.
                user.DisplayName = request.DisplayName ?? user.DisplayName;

                //If we want always get 200 back even without changes - uncomment below
                //context.Entry(user).State = EntityState.Modified;

                var success = await _context.SaveChangesAsync() > 0;

                // if SaveChangesAsync returns a value greater than 0), it returns a successful Result<Unit> indicating that the profile was updated.
                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem updating profile");

            }
        }
    }
}