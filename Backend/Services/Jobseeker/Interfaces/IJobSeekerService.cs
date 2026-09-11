using Backend.DTOs.Jobseeker;

namespace Backend.Services.Jobseeker.Interfaces
{
    public interface IJobSeekerService
    {
        Task<JobSeekerProfileDto?> GetProfileAsync(int userId);

        Task<JobSeekerProfileDto> CreateProfileAsync(
            int userId,
            JobSeekerProfileDto dto);

        Task<JobSeekerProfileDto?> UpdateProfileAsync(
            int userId,
            JobSeekerProfileDto dto);

        Task<CvResponseDto> UploadCvAsync(
            int userId,
            UploadCvDto dto);
    }
}