using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser //Photos has a relationship with user (one-to-many)
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}