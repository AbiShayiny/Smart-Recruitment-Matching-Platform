using Backend.Data;
using Backend.Models.JobSeeker;
using Backend.Repositories.Jobseeker.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Jobseeker.Implementations
{
    public class JobSeekerRepository : IJobSeekerRepository
    {
        private readonly ApplicationDbContext _context;

        public JobSeekerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<JobSeekerProfile?> GetByUserIdAsync(int userId)
        {
            return await _context.JobSeekerProfiles
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<JobSeekerProfile> CreateAsync(JobSeekerProfile profile)
        {
            await _context.JobSeekerProfiles.AddAsync(profile);
            await _context.SaveChangesAsync();

            return profile;
        }

        public async Task<JobSeekerProfile> UpdateAsync(JobSeekerProfile profile)
        {
            _context.JobSeekerProfiles.Update(profile);
            await _context.SaveChangesAsync();

            return profile;
        }

        public async Task<JobSeekerCv?> GetCvByUserIdAsync(int userId)
        {
            return await _context.JobSeekerCvs
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<JobSeekerCv> SaveCvAsync(JobSeekerCv cv)
        {
            await _context.JobSeekerCvs.AddAsync(cv);
            await _context.SaveChangesAsync();

            return cv;
        }
    }
}