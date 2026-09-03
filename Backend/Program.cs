using Backend.Data;
using Backend.Repositories.Jobseeker.Implementations;
using Backend.Repositories.Jobseeker.Interfaces;
using Backend.Services.Jobseeker.Implementations;
using Backend.Services.Jobseeker.Interfaces;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Repositories.Company.Implementations;
using Backend.Repositories.Company.Interfaces;
using Backend.Services.Company.Implementations;
using Backend.Services.Company.Interfaces;
using Microsoft.EntityFrameworkCore;
using Backend.Repositories.Vacancy.Implementations;
using Backend.Repositories.Vacancy.Interfaces;
using Backend.Services.Vacancy.Implementations;
using Backend.Services.Vacancy.Interfaces;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Database Connection
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            // JobSeeker Repository
            builder.Services.AddScoped<IJobSeekerRepository, JobSeekerRepository>();
            builder.Services.AddDbContext<AppDbContext>(options =>
               options.UseSqlServer(
                 builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();

            builder.Services.AddScoped<ICompanyService, CompanyService>();


            // JobSeeker Service
            builder.Services.AddScoped<IJobSeekerService, JobSeekerService>();

            // Swagger
            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IVacancyRepository, VacancyRepository>();
            builder.Services.AddScoped<IVacancyService, VacancyService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
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