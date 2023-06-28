
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Storage;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            public IPhototAccessor _phototAccessor;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhototAccessor phototAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _phototAccessor = phototAccessor;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Photos) //inside Users table
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id); //we are not using FirstOrDefaultAsync - we already retrieved a user from DB and we included a photo collection
                //so in memory we have access to Photos collection

                if (photo == null) return null;

                if (photo.IsMain) return Result<Unit>.Failure("You cannot delete your main photo");

                //attempt to delete from cloudinary
                var result = await _phototAccessor.DeletePhoto(photo.Id);

                if (result == null) return Result<Unit>.Failure("Problem deleting photo from the Cloudinary");

                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting photo from the API");
            }
        }
    }
}