using Backend.Models.Application;

namespace Backend.Repositories.Application.Interfaces
{
    public interface IApplicationRepository
    {
        Task<JobApplication?> GetByIdAsync(int applicationId);

        Task<bool> ExistsAsync(int jobSeekerProfileId, int vacancyId);

        Task<JobApplication> CreateAsync(JobApplication application);

        Task<List<JobApplication>> GetByJobSeekerAsync(
            int jobSeekerProfileId);

        Task<List<JobApplication>> GetByVacancyAsync(int vacancyId);

        Task<JobApplication> UpdateAsync(JobApplication application);
    }
}
