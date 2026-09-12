using Backend.Models.Employer;
using Backend.Models.JobSeeker;
using Backend.Models.User;
using Backend.Models.Vacancy;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Company> Companies { get; set; }

        public DbSet<JobSeekerCv> JobSeekerCvs { get; set; }

        public DbSet<JobSeekerProfile> JobSeekerProfiles { get; set; }

        public DbSet<Vacancy> Vacancies { get; set; }

        public DbSet<Backend.Models.Application.JobApplication>
            JobApplications { get; set; }

        public DbSet<Backend.Models.Notification.Notification>
            Notifications { get; set; }

        public DbSet<Backend.Models.Contact.ContactRequest>
            ContactRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Backend.Models.Application.JobApplication>()
                .HasIndex(application => new
                {
                    application.JobSeekerProfileId,
                    application.VacancyId
                })
                .IsUnique();

            modelBuilder.Entity<Backend.Models.Application.JobApplication>()
                .HasOne(application => application.JobSeekerProfile)
                .WithMany()
                .HasForeignKey(application => application.JobSeekerProfileId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Backend.Models.Application.JobApplication>()
                .HasOne(application => application.Vacancy)
                .WithMany()
                .HasForeignKey(application => application.VacancyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Backend.Models.Notification.Notification>()
                .HasIndex(notification => notification.UserId);

            modelBuilder.Entity<Backend.Models.Notification.Notification>()
                .HasOne(notification => notification.User)
                .WithMany()
                .HasForeignKey(notification => notification.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Backend.Models.Notification.Notification>()
                .HasOne(notification => notification.Application)
                .WithMany()
                .HasForeignKey(notification => notification.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Backend.Models.Contact.ContactRequest>()
                .HasIndex(request => new
                {
                    request.EmployerUserId,
                    request.JobSeekerProfileId,
                    request.ApplicationId
                })
                .IsUnique();

            modelBuilder.Entity<Backend.Models.Contact.ContactRequest>()
                .HasOne(request => request.EmployerUser)
                .WithMany()
                .HasForeignKey(request => request.EmployerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Backend.Models.Contact.ContactRequest>()
                .HasOne(request => request.JobSeekerProfile)
                .WithMany()
                .HasForeignKey(request => request.JobSeekerProfileId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Backend.Models.Contact.ContactRequest>()
                .HasOne(request => request.Application)
                .WithMany()
                .HasForeignKey(request => request.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
