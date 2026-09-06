using Backend.Models.Employer;
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

        public DbSet<Company> Companies { get; set; }

        public DbSet<Vacancy> Vacancies { get; set; }
    }
}
