using Backend.Data;
using Backend.Repositories.Company.Implementations;
using Backend.Repositories.Company.Interfaces;
using Backend.Repositories.User.Implementations;
using Backend.Repositories.User.Interfaces;
using Backend.Services.Authentication.Implementations;
using Backend.Services.Authentication.Interfaces;
using Backend.Repositories.Jobseeker.Implementations;
using Backend.Repositories.Jobseeker.Interfaces;
using Backend.Services.Company.Implementations;
using Backend.Services.Company.Interfaces;
using Backend.Services.Admin.Implementations;
using Backend.Services.Admin.Interfaces;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Backend.Services.Jobseeker.Implementations;
using Backend.Services.Jobseeker.Interfaces;
using Microsoft.EntityFrameworkCore;
using Backend.Repositories.Vacancy.Implementations;
using Backend.Repositories.Vacancy.Interfaces;
using Backend.Services.Vacancy.Implementations;
using Backend.Services.Vacancy.Interfaces;
using Microsoft.IdentityModel.Tokens;

using System.Text;

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

            // User Repository
            builder.Services.AddScoped<IUserRepository, UserRepository>();

            // Authentication Service
            builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

            // Admin Service
            builder.Services.AddScoped<IAdminService, AdminService>();

            // JWT Authentication
            builder.Services.AddAuthentication(
                JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters =
                        new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,

                            ValidIssuer =
                                builder.Configuration["Jwt:Issuer"],

                            ValidAudience =
                                builder.Configuration["Jwt:Audience"],

                            IssuerSigningKey =
                                new SymmetricSecurityKey(
                                    Encoding.UTF8.GetBytes(
                                        builder.Configuration["Jwt:Key"]!))
                        };
                });

            // Controllers
            builder.Services.AddControllers();
            // JobSeeker Repository and Service
            builder.Services.AddScoped<IJobSeekerRepository, JobSeekerRepository>();
            builder.Services.AddScoped<IJobSeekerService, JobSeekerService>();

            // Swagger
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition(
                    "Bearer",
                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                    {
                        Name = "Authorization",
                        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                        Scheme = "Bearer",
                        BearerFormat = "JWT",
                        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                        Description = "Enter JWT token like: Bearer {your token}"
                    });

                options.AddSecurityRequirement(
                    new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                    {
                        {
                            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                            {
                                Reference =
                                    new Microsoft.OpenApi.Models.OpenApiReference
                                    {
                                        Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                        Id = "Bearer"
                                    }
                            },
                            Array.Empty<string>()
                        }
                    });
            });

            builder.Services.AddScoped<IVacancyRepository, VacancyRepository>();
            builder.Services.AddScoped<IVacancyService, VacancyService>();

            var app = builder.Build();

            // Configure HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // JWT Authentication
            app.UseAuthentication();

            // Authorization
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}