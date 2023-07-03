namespace Domain
{
    public class Activity
    {

        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public bool IsCancelled { get; set; }
        public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>(); //we are adding collection of attendees to prevent assigning null to Attendees in responses, so we are initializing a List
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    }
}