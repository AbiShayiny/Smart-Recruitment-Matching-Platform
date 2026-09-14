using Backend.Models.JobSeeker;

namespace Backend.Repositories.Jobseeker.Interfaces
{
    public interface IJobSeekerRepository
    {
        Task<JobSeekerProfile?> GetByUserIdAsync(int userId);

        Task<JobSeekerProfile> CreateAsync(JobSeekerProfile profile);

        Task<JobSeekerProfile> UpdateAsync(JobSeekerProfile profile);

        Task<JobSeekerCv?> GetCvByUserIdAsync(int userId);

        Task<JobSeekerCv> SaveCvAsync(JobSeekerCv cv);
    }
}