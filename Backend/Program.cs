using Backend.Data;

using Backend.Repositories.Implementations.User;
using Backend.Repositories.Interfaces.User;

using Backend.Repositories.Jobseeker.Implementations;
using Backend.Repositories.Jobseeker.Interfaces;

using Backend.Repositories.Vacancy.Implementations;
using Backend.Repositories.Vacancy.Interfaces;

using Backend.Services.Implementations.Admin;
using Backend.Services.Implementations.Authentication;

using Backend.Services.Interfaces.Admin;
using Backend.Services.Interfaces.Authentication;

using Backend.Services.Matching.Implementations;
using Backend.Services.Matching.Interfaces;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using System.Text;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add Controllers
            builder.Services.AddControllers();


            // Database
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                )
            );


            // User Repository
            builder.Services.AddScoped<
                IUserRepository,
                UserRepository
            >();


            // Authentication Service
            builder.Services.AddScoped<
                IAuthenticationService,
                AuthenticationService
            >();


            // Admin Service
            builder.Services.AddScoped<
                IAdminService,
                AdminService
            >();


            // Job Seeker Repository
            builder.Services.AddScoped<
                IJobSeekerRepository,
                JobSeekerRepository
            >();


            // Vacancy Repository
            builder.Services.AddScoped<
                IVacancyRepository,
                VacancyRepository
            >();


            // Matching Service
            builder.Services.AddScoped<
                IMatchingService,
                MatchingService
            >();


            // Application Service
            builder.Services.AddScoped<
                Repositories.Application.Interfaces.IApplicationRepository,
                Repositories.Application.Implementations.ApplicationRepository
            >();

            builder.Services.AddScoped<
                Services.Application.Interfaces.IApplicationService,
                Services.Application.Implementations.ApplicationService
            >();


            // Notification Service
            builder.Services.AddScoped<
                Repositories.Notification.Interfaces.INotificationRepository,
                Repositories.Notification.Implementations.NotificationRepository
            >();

            builder.Services.AddScoped<
                Services.Notification.Interfaces.INotificationService,
                Services.Notification.Implementations.NotificationService
            >();


            // Contact Request Service
            builder.Services.AddScoped<
                Repositories.ContactRequest.Interfaces.IContactRequestRepository,
                Repositories.ContactRequest.Implementations.ContactRequestRepository
            >();

            builder.Services.AddScoped<
                Services.Contact.Interfaces.IContactRequestService,
                Services.Contact.Implementations.ContactRequestService
            >();


            // CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins(
                            "http://localhost:4200"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });


            // JWT Authentication
            builder.Services
                .AddAuthentication(
                    JwtBearerDefaults.AuthenticationScheme
                )
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
                                builder.Configuration[
                                    "Jwt:Issuer"
                                ],

                            ValidAudience =
                                builder.Configuration[
                                    "Jwt:Audience"
                                ],

                            IssuerSigningKey =
                                new SymmetricSecurityKey(
                                    Encoding.UTF8.GetBytes(
                                        builder.Configuration[
                                            "Jwt:Key"
                                        ]!
                                    )
                                )
                        };
                });


            // Authorization
            builder.Services.AddAuthorization();


            // Swagger
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition(
                    "Bearer",
                    new OpenApiSecurityScheme
                    {
                        Name = "Authorization",

                        Type = SecuritySchemeType.Http,

                        Scheme = "bearer",

                        BearerFormat = "JWT",

                        In = ParameterLocation.Header,

                        Description =
                            "Enter your JWT token."
                    }
                );

                options.AddSecurityRequirement(
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference =
                                    new OpenApiReference
                                    {
                                        Type =
                                            ReferenceType.SecurityScheme,

                                        Id = "Bearer"
                                    }
                            },

                            Array.Empty<string>()
                        }
                    }
                );
            });


            // Build Application
            var app = builder.Build();


            // Swagger
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();

                app.UseSwaggerUI();
            }


            // HTTPS
            app.UseHttpsRedirection();


            // CORS
            app.UseCors("AllowFrontend");


            // Authentication
            app.UseAuthentication();


            // Authorization
            app.UseAuthorization();


            // Controllers
            app.MapControllers();


            // Run
            app.Run();
        }
    }
}