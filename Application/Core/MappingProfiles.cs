using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    //The purpose of this class is to define how objects of certain types should be mapped to other types.
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //self-mapping, indicating that an Activity object should be mapped to another Activity object.
            CreateMap<Activity, Activity>();

            //Following mapping displayes The AppUser is obtained from the Attendees collection of the Activity object, where the first attendee with IsHost set to true is selected.
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            //Following mapping defines how an ActivitiyAttendee object should be mapped to a Profiles.Profile object. It appears to be mapping an attendee of an activity to a profile object.
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, options => options.MapFrom(source => source.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, options => options.MapFrom(source => source.Author.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}