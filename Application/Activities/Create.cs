using Domain;
using MediatR;
using Storage;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; } // from Domain
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;

            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken) 
            {
                _context.Activities.Add(request.Activity); //Add used because we are adding activity in memory. We are not touching database at this point. No need AddAsync
                await _context.SaveChangesAsync();
                //Unit it's just an object that mediator provides (without any value), but it tells to API that request is finished. Therefore we need to complete by returning something in our case it's Unit.Value, but in reality it equivalent to nothing.
                return Unit.Value;

            }
        }
    }
}