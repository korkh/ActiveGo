using Application.Core;
using Domain;
using MediatR;
using Storage;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<Activity>>
        {
            public Guid Id { get; set; }
        }

        //Class for the Handler
        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
            public DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);
                
                return Result<Activity>.Success(activity);
            }
        }
    }
}