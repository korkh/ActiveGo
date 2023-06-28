using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Storage;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhototAccessor _phototAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhototAccessor phototAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _phototAccessor = phototAccessor;
                _context = context;

            }
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());  //we need access users photo collection

                if (user == null) return null;

                var photoUploadResult = await _phototAccessor.AddPhoto(request.File); //it also will throw an exception

                //new photo
                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                //Check if user any photo set to Main
                if (!user.Photos.Any(x => x.IsMain)) photo.IsMain = true; //if there was no photos set to main so we can set it.

                //add photos to users collection
                user.Photos.Add(photo);

                //saving changes to database
                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Result<Photo>.Success(photo);

                //in case of fail
                return Result<Photo>.Failure("Failed to upload the photo");
            }
        }
    }
}