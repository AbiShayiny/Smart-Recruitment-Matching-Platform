using Backend.Models.JobSeeker;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<JobSeekerProfile> JobSeekerProfiles
            => Set<JobSeekerProfile>();

        public DbSet<JobSeekerCv> JobSeekerCvs
            => Set<JobSeekerCv>();
    }
}