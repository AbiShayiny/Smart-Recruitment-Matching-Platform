using Backend.DTOs.Jobseeker;
using Backend.Models.JobSeeker;
using Backend.Repositories.Jobseeker.Interfaces;
using Backend.Services.Jobseeker.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace Backend.Services.Jobseeker.Implementations
{
    public class JobSeekerService : IJobSeekerService
    {
        private readonly IJobSeekerRepository _repository;
        private readonly IWebHostEnvironment _environment;

        public JobSeekerService(
            IJobSeekerRepository repository,
            IWebHostEnvironment environment)
        {
            _repository = repository;
            _environment = environment;
        }

        // Get Job Seeker Profile
        public async Task<JobSeekerProfileDto?> GetProfileAsync(int userId)
        {
            var profile = await _repository.GetByUserIdAsync(userId);

            if (profile == null)
            {
                return null;
            }

            return new JobSeekerProfileDto
            {
                Skills = profile.Skills,
                Experience = profile.Experience,
                Education = profile.Education
            };
        }

        // Create Job Seeker Profile
        public async Task<JobSeekerProfileDto> CreateProfileAsync(
            int userId,
            JobSeekerProfileDto dto)
        {
            // Check whether this user already has a profile
            var existingProfile =
                await _repository.GetByUserIdAsync(userId);

            if (existingProfile != null)
            {
                throw new InvalidOperationException(
                    "Job seeker profile already exists.");
            }

            // Create new profile
            var profile = new JobSeekerProfile
            {
                UserId = userId,
                Skills = dto.Skills,
                Experience = dto.Experience,
                Education = dto.Education
            };

            // Save profile to database
            var createdProfile =
                await _repository.CreateAsync(profile);

            // Return response
            return new JobSeekerProfileDto
            {
                Skills = createdProfile.Skills,
                Experience = createdProfile.Experience,
                Education = createdProfile.Education
            };
        }

        // Update Job Seeker Profile
        public async Task<JobSeekerProfileDto?> UpdateProfileAsync(
            int userId,
            JobSeekerProfileDto dto)
        {
            var profile =
                await _repository.GetByUserIdAsync(userId);

            if (profile == null)
            {
                return null;
            }

            profile.Skills = dto.Skills;
            profile.Experience = dto.Experience;
            profile.Education = dto.Education;

            var updatedProfile =
                await _repository.UpdateAsync(profile);

            return new JobSeekerProfileDto
            {
                Skills = updatedProfile.Skills,
                Experience = updatedProfile.Experience,
                Education = updatedProfile.Education
            };
        }

        // Upload Job Seeker CV
        public async Task<CvResponseDto> UploadCvAsync(
            int userId,
            UploadCvDto dto)
        {
            // Check whether CV file exists
            if (dto.CvFile == null ||
                dto.CvFile.Length == 0)
            {
                throw new ArgumentException(
                    "CV file is required.");
            }

            // Get file extension
            var extension =
                Path.GetExtension(dto.CvFile.FileName)
                    .ToLowerInvariant();

            // Allowed CV file types
            var allowedExtensions = new[]
            {
                ".pdf",
                ".doc",
                ".docx"
            };

            // Validate file extension
            if (!allowedExtensions.Contains(extension))
            {
                throw new ArgumentException(
                    "Only PDF, DOC and DOCX files are allowed.");
            }

            // Protected CV storage folder
            var storageFolder = Path.Combine(
                _environment.ContentRootPath,
                "Storage",
                "CVs");

            // Create folder if it does not exist
            Directory.CreateDirectory(storageFolder);

            // Generate unique file name
            var storedFileName =
                $"{Guid.NewGuid()}{extension}";

            // Full file path
            var filePath = Path.Combine(
                storageFolder,
                storedFileName);

            // Save actual CV file
            using (var stream = new FileStream(
                filePath,
                FileMode.Create))
            {
                await dto.CvFile.CopyToAsync(stream);
            }

            // Create CV metadata
            var cv = new JobSeekerCv
            {
                UserId = userId,
                OriginalFileName = dto.CvFile.FileName,
                StoredFileName = storedFileName,
                FilePath = filePath,
                ContentType = dto.CvFile.ContentType,
                FileSize = dto.CvFile.Length,
                UploadedAt = DateTime.UtcNow
            };

            // Save CV metadata to database
            var savedCv =
                await _repository.SaveCvAsync(cv);

            // Return safe CV information
            return new CvResponseDto
            {
                OriginalFileName =
                    savedCv.OriginalFileName,

                ContentType =
                    savedCv.ContentType,

                FileSize =
                    savedCv.FileSize,

                UploadedAt =
                    savedCv.UploadedAt
            };
        }
    }
}
