using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Storage
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; } //now we can add migration
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; } //now we can add migration
        public DbSet<Photo> Photos { get; set; } //now we can add migration
        public DbSet<Comment> Comments { get; set; }

        //we need overide IdentityDbContext method
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //Configuration many-to-many relationship
            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId })); //creating new Primary key as combination of 2 Id (AppUserId & ActivityId)
            builder.Entity<ActivityAttendee>()
                            .HasOne(u => u.AppUser)
                            .WithMany(a => a.Activities)
                            .HasForeignKey(aa => aa.AppUserId);
            builder.Entity<ActivityAttendee>()
                            .HasOne(u => u.Activity)
                            .WithMany(a => a.Attendees)
                            .HasForeignKey(aa => aa.ActivityId);

            builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade); //if we will delete an activity it will cascade down comments assosiated with that activity

        }
    }
}