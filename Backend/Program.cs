using Backend.Data;
using Backend.Repositories.Jobseeker.Implementations;
using Backend.Repositories.Jobseeker.Interfaces;
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

            // Add services to the container.
            builder.Services.AddControllers();

            // Database Connection
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            // JobSeeker Repository
            builder.Services.AddScoped<IJobSeekerRepository, JobSeekerRepository>();

            // JobSeeker Service
            builder.Services.AddScoped<IJobSeekerService, JobSeekerService>();

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

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