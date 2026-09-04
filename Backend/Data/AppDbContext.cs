using Backend.Models.Employer;
using Backend.Models.JobSeeker;
using Microsoft.EntityFrameworkCore;
using Backend.Models.Vacancy;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Employer
        public DbSet<Company> Companies { get; set; }

        // JobSeeker
        public DbSet<JobSeekerProfile> JobSeekerProfiles { get; set; }

        // JobSeeker CV
        public DbSet<JobSeekerCv> JobSeekerCvs { get; set; }
    }
}
