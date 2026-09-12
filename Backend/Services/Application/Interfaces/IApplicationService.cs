using Backend.DTOs.Application;

namespace Backend.Services.Application.Interfaces
{
    public interface IApplicationService
    {
        Task<ApplicationDto> ApplyAsync(int userId, int vacancyId);

        Task<List<ApplicationDto>?> GetMyApplicationsAsync(int userId);

        Task<List<ApplicantDto>?> GetApplicantsAsync(int vacancyId);

        Task<ApplicationDto?> UpdateStatusAsync(
            int applicationId,
            string status);
    }
}
