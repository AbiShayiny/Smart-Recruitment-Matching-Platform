using Backend.Data;
using Backend.Repositories.Company.Implementations;
using Backend.Repositories.Company.Interfaces;
using Backend.Repositories.Jobseeker.Implementations;
using Backend.Repositories.Jobseeker.Interfaces;
using Backend.Services.Company.Implementations;
using Backend.Services.Company.Interfaces;
using Backend.Services.Jobseeker.Implementations;
using Backend.Services.Jobseeker.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Controllers
            builder.Services.AddControllers();

            // Database Connection
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            // Company Repository and Service
            builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
            builder.Services.AddScoped<ICompanyService, CompanyService>();

            // JobSeeker Repository and Service
            builder.Services.AddScoped<IJobSeekerRepository, JobSeekerRepository>();
            builder.Services.AddScoped<IJobSeekerService, JobSeekerService>();

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}