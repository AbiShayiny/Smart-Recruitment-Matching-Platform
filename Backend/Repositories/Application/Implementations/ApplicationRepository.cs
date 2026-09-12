using Backend.Data;
using Backend.Models.Application;
using Backend.Repositories.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Application.Implementations
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly AppDbContext _context;

        public ApplicationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<JobApplication?> GetByIdAsync(int applicationId)
        {
            return await _context.JobApplications
                .Include(application => application.JobSeekerProfile)
                .Include(application => application.Vacancy)
                .FirstOrDefaultAsync(application =>
                    application.Id == applicationId);
        }

        public async Task<bool> ExistsAsync(
            int jobSeekerProfileId,
            int vacancyId)
        {
            return await _context.JobApplications.AnyAsync(application =>
                application.JobSeekerProfileId == jobSeekerProfileId &&
                application.VacancyId == vacancyId);
        }

        public async Task<JobApplication> CreateAsync(
            JobApplication application)
        {
            await _context.JobApplications.AddAsync(application);
            await _context.SaveChangesAsync();

            return application;
        }

        public async Task<List<JobApplication>> GetByJobSeekerAsync(
            int jobSeekerProfileId)
        {
            return await _context.JobApplications
                .Include(application => application.Vacancy)
                .Where(application =>
                    application.JobSeekerProfileId == jobSeekerProfileId)
                .OrderByDescending(application => application.AppliedAt)
                .ToListAsync();
        }

        public async Task<List<JobApplication>> GetByVacancyAsync(
            int vacancyId)
        {
            return await _context.JobApplications
                .Include(application => application.JobSeekerProfile)
                .Where(application => application.VacancyId == vacancyId)
                .ToListAsync();
        }

        public async Task<JobApplication> UpdateAsync(
            JobApplication application)
        {
            _context.JobApplications.Update(application);
            await _context.SaveChangesAsync();

            return application;
        }
    }
}
