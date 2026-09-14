using Backend.DTOs.Jobseeker;
using Backend.Models.JobSeeker;
using Backend.Repositories.Jobseeker.Interfaces;
using Backend.Services.Jobseeker.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Backend.Repositories.Interfaces.User;

namespace Backend.Services.Jobseeker.Implementations
{
    public class JobSeekerService : IJobSeekerService
    {
        private readonly IJobSeekerRepository _repository;
        private readonly IWebHostEnvironment _environment;
        private readonly IUserRepository _userRepository;

        public JobSeekerService(
            IJobSeekerRepository repository,
            IWebHostEnvironment environment,
            IUserRepository userRepository)
        {
            _repository = repository;
            _environment = environment;
            _userRepository = userRepository;
        }

        // Get Job Seeker Profile
        public async Task<JobSeekerProfileDto?> GetProfileAsync(int userId)
        {
            var profile = await _repository.GetByUserIdAsync(userId);
            var user = _userRepository.GetUserById(userId);

            if (profile == null || user == null)
            {
                return null;
            }

            return MapProfile(profile, user.Name, user.Email);
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
                Education = dto.Education,
                Location = dto.Location,
                PhoneNumber = dto.PhoneNumber,
                ProfessionalTitle = dto.ProfessionalTitle,
                ProfessionalSummary = dto.ProfessionalSummary,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Save profile to database
            var createdProfile =
                await _repository.CreateAsync(profile);

            var user = _userRepository.GetUserById(userId)!;
            user.Name = ComposeName(dto.FirstName, dto.LastName);
            _userRepository.UpdateUser(user);

            // Return response
            return MapProfile(createdProfile, user.Name, user.Email);
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
            profile.Location = dto.Location;
            profile.PhoneNumber = dto.PhoneNumber;
            profile.ProfessionalTitle = dto.ProfessionalTitle;
            profile.ProfessionalSummary = dto.ProfessionalSummary;
            profile.UpdatedAt = DateTime.UtcNow;

            var updatedProfile =
                await _repository.UpdateAsync(profile);

            var user = _userRepository.GetUserById(userId);
            if (user == null) return null;
            user.Name = ComposeName(dto.FirstName, dto.LastName);
            _userRepository.UpdateUser(user);

            return MapProfile(updatedProfile, user.Name, user.Email);
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

        public async Task<(byte[] Content, string ContentType, string FileName)?>
            GetCvAsync(int userId)
        {
            var cv = await _repository.GetCvByUserIdAsync(userId);

            if (cv == null)
            {
                return null;
            }

            var storageFolder = Path.GetFullPath(Path.Combine(
                _environment.ContentRootPath,
                "Storage",
                "CVs"));
            var storedFileName = Path.GetFileName(cv.StoredFileName);
            var filePath = Path.GetFullPath(Path.Combine(
                storageFolder,
                storedFileName));

            if (storedFileName != cv.StoredFileName ||
                !filePath.StartsWith(
                    storageFolder + Path.DirectorySeparatorChar,
                    StringComparison.OrdinalIgnoreCase) ||
                !File.Exists(filePath))
            {
                return null;
            }

            var contentType = Path.GetExtension(storedFileName).ToLowerInvariant() switch
            {
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                _ => "application/octet-stream"
            };

            return (
                await File.ReadAllBytesAsync(filePath),
                contentType,
                cv.OriginalFileName);
        }

        private static string ComposeName(string firstName, string lastName) =>
            string.Join(" ", new[] { firstName, lastName }
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Select(value => value.Trim()));

        private static JobSeekerProfileDto MapProfile(
            JobSeekerProfile profile,
            string name,
            string email)
        {
            var nameParts = name.Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
            return new JobSeekerProfileDto
            {
                FirstName = nameParts.ElementAtOrDefault(0) ?? string.Empty,
                LastName = nameParts.ElementAtOrDefault(1) ?? string.Empty,
                Email = email,
                PhoneNumber = profile.PhoneNumber,
                ProfessionalTitle = profile.ProfessionalTitle,
                ProfessionalSummary = profile.ProfessionalSummary,
                Skills = profile.Skills,
                Experience = profile.Experience,
                Education = profile.Education,
                Location = profile.Location,
                CreatedAt = profile.CreatedAt,
                UpdatedAt = profile.UpdatedAt
            };
        }
    }
}
