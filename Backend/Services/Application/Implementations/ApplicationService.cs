using Backend.DTOs.Application;
using Backend.Models.Application;
using Backend.Repositories.Application.Interfaces;
using Backend.Repositories.Jobseeker.Interfaces;
using Backend.Repositories.Vacancy.Interfaces;
using Backend.Services.Application.Interfaces;
using Backend.Services.Matching.Interfaces;
using Backend.Services.Notification.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Application.Implementations
{
    public class ApplicationService : IApplicationService
    {
        private static readonly HashSet<string> ValidStatuses =
            new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "Pending",
                "Reviewed",
                "Shortlisted",
                "Accepted",
                "Rejected"
            };

        private readonly IApplicationRepository _applicationRepository;
        private readonly IJobSeekerRepository _jobSeekerRepository;
        private readonly IVacancyRepository _vacancyRepository;
        private readonly IMatchingService _matchingService;
        private readonly INotificationService _notificationService;

        public ApplicationService(
            IApplicationRepository applicationRepository,
            IJobSeekerRepository jobSeekerRepository,
            IVacancyRepository vacancyRepository,
            IMatchingService matchingService,
            INotificationService notificationService)
        {
            _applicationRepository = applicationRepository;
            _jobSeekerRepository = jobSeekerRepository;
            _vacancyRepository = vacancyRepository;
            _matchingService = matchingService;
            _notificationService = notificationService;
        }

        public async Task<ApplicationDto> ApplyAsync(
            int userId,
            int vacancyId)
        {
            var profile = await _jobSeekerRepository
                .GetByUserIdAsync(userId);

            if (profile == null)
            {
                throw new KeyNotFoundException(
                    "Job seeker profile not found.");
            }

            var vacancy = await _vacancyRepository.GetByIdAsync(vacancyId);

            if (vacancy == null)
            {
                throw new KeyNotFoundException("Vacancy not found.");
            }

            if (await _applicationRepository.ExistsAsync(
                profile.Id,
                vacancyId))
            {
                throw new InvalidOperationException(
                    "You have already applied for this vacancy.");
            }

            var now = DateTime.UtcNow;
            var application = new JobApplication
            {
                JobSeekerProfileId = profile.Id,
                VacancyId = vacancyId,
                Status = "Pending",
                AppliedAt = now,
                UpdatedAt = now
            };

            try
            {
                await _applicationRepository.CreateAsync(application);
            }
            catch (DbUpdateException)
            {
                if (await _applicationRepository.ExistsAsync(
                    profile.Id,
                    vacancyId))
                {
                    throw new InvalidOperationException(
                        "You have already applied for this vacancy.");
                }

                throw;
            }

            return MapApplication(application, vacancy.JobTitle);
        }

        public async Task<List<ApplicationDto>?> GetMyApplicationsAsync(
            int userId)
        {
            var profile = await _jobSeekerRepository
                .GetByUserIdAsync(userId);

            if (profile == null)
            {
                return null;
            }

            var applications = await _applicationRepository
                .GetByJobSeekerAsync(profile.Id);

            return applications.Select(application =>
                MapApplication(
                    application,
                    application.Vacancy.JobTitle))
                .ToList();
        }

        public async Task<List<ApplicantDto>?> GetApplicantsAsync(
            int vacancyId)
        {
            var vacancy = await _vacancyRepository.GetByIdAsync(vacancyId);

            if (vacancy == null)
            {
                return null;
            }

            var applications = await _applicationRepository
                .GetByVacancyAsync(vacancyId);

            var applicants = new List<ApplicantDto>();

            foreach (var application in applications)
            {
                var match = await _matchingService.CalculateMatchAsync(
                    application.JobSeekerProfile.UserId,
                    vacancyId);

                applicants.Add(new ApplicantDto
                {
                    ApplicationId = application.Id,
                    JobSeekerProfileId = application.JobSeekerProfileId,
                    Skills = application.JobSeekerProfile.Skills,
                    Experience = application.JobSeekerProfile.Experience,
                    Education = application.JobSeekerProfile.Education,
                    Location = application.JobSeekerProfile.Location,
                    Status = application.Status,
                    AppliedAt = application.AppliedAt,
                    UpdatedAt = application.UpdatedAt,
                    MatchScore = match?.MatchScore
                });
            }

            return applicants
                .OrderByDescending(applicant => applicant.MatchScore)
                .ToList();
        }

        public async Task<ApplicationDto?> UpdateStatusAsync(
            int applicationId,
            string status)
        {
            var validStatus = ValidStatuses.FirstOrDefault(value =>
                value.Equals(status.Trim(), StringComparison.OrdinalIgnoreCase));

            if (validStatus == null)
            {
                throw new ArgumentException("Invalid application status.");
            }

            var application = await _applicationRepository
                .GetByIdAsync(applicationId);

            if (application == null)
            {
                return null;
            }

            application.Status = validStatus;
            application.UpdatedAt = DateTime.UtcNow;

            await _applicationRepository.UpdateAsync(application);

            await _notificationService.CreateAsync(
                application.JobSeekerProfile.UserId,
                application.Id,
                $"Your application for {application.Vacancy.JobTitle} " +
                $"has been updated to {validStatus}.");

            return MapApplication(
                application,
                application.Vacancy.JobTitle);
        }

        private static ApplicationDto MapApplication(
            JobApplication application,
            string jobTitle)
        {
            return new ApplicationDto
            {
                Id = application.Id,
                VacancyId = application.VacancyId,
                JobTitle = jobTitle,
                Status = application.Status,
                AppliedAt = application.AppliedAt,
                UpdatedAt = application.UpdatedAt
            };
        }
    }
}
