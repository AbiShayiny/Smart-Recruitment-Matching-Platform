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
    }
}