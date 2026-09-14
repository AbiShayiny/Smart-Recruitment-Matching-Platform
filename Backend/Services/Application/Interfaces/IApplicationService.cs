using Backend.DTOs.Application;

namespace Backend.Services.Application.Interfaces
{
    public interface IApplicationService
    {
        Task<ApplicationDto> ApplyAsync(int userId, int vacancyId);

        Task<List<ApplicationDto>?> GetMyApplicationsAsync(int userId);

        Task<List<ApplicantDto>?> GetApplicantsAsync(int vacancyId);

        Task<List<ApplicantDto>> GetEmployerApplicantsAsync(int companyId);

        Task<ApplicantDto?> GetApplicantAsync(int applicationId);

        Task<(byte[] Content, string ContentType, string FileName)?>
            GetApplicantCvAsync(int applicationId);

        Task<ApplicationDto?> UpdateStatusAsync(
            int applicationId,
            string status);
    }
}
