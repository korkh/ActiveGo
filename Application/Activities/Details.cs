using Domain;
using MediatR;
using Storage;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id {get; set;}
        }

        //Class for the Handler
        public class Handler : IRequestHandler<Query, Activity>
        {
            public DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.FindAsync(request.Id);
            }
        }
    }
}