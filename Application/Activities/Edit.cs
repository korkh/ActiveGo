using AutoMapper;
using Domain;
using MediatR;
using Storage;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);

                // activity.Title = request.Activity.Title ?? activity.Title; 
                //instead of type each property we will use AutoMapper.Extension from NuGet to map all

                _mapper.Map(request.Activity, activity);

                await _context.SaveChangesAsync();

                return Unit.Value; //Notofocation to API that work has completed
            }
        }
    }
}