using Backend.DTOs.Contact;
using Backend.Models.Contact;
using Backend.Repositories.Application.Interfaces;
using Backend.Repositories.ContactRequest.Interfaces;
using Backend.Repositories.Jobseeker.Interfaces;
using Backend.Services.Contact.Interfaces;
using Backend.Services.Notification.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Contact.Implementations
{
    public class ContactRequestService : IContactRequestService
    {
        private readonly IContactRequestRepository _contactRequestRepository;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IJobSeekerRepository _jobSeekerRepository;
        private readonly INotificationService _notificationService;

        public ContactRequestService(
            IContactRequestRepository contactRequestRepository,
            IApplicationRepository applicationRepository,
            IJobSeekerRepository jobSeekerRepository,
            INotificationService notificationService)
        {
            _contactRequestRepository = contactRequestRepository;
            _applicationRepository = applicationRepository;
            _jobSeekerRepository = jobSeekerRepository;
            _notificationService = notificationService;
        }

        public async Task<ContactRequestDto> SendAsync(
            int employerUserId,
            CreateContactRequestDto dto)
        {
            var application = await _applicationRepository
                .GetByIdAsync(dto.ApplicationId);

            if (application == null)
            {
                throw new KeyNotFoundException("Application not found.");
            }

            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                throw new ArgumentException("Message is required.");
            }

            if (await _contactRequestRepository.ExistsAsync(
                employerUserId,
                application.JobSeekerProfileId,
                application.Id))
            {
                throw new InvalidOperationException(
                    "A contact request already exists for this candidate.");
            }

            var now = DateTime.UtcNow;
            var request = new ContactRequest
            {
                EmployerUserId = employerUserId,
                JobSeekerProfileId = application.JobSeekerProfileId,
                ApplicationId = application.Id,
                Message = dto.Message.Trim(),
                Status = "Pending",
                CreatedAt = now,
                UpdatedAt = now,
                Application = application
            };

            try
            {
                await _contactRequestRepository.CreateAsync(request);
            }
            catch (DbUpdateException)
            {
                if (await _contactRequestRepository.ExistsAsync(
                    employerUserId,
                    application.JobSeekerProfileId,
                    application.Id))
                {
                    throw new InvalidOperationException(
                        "A contact request already exists for this candidate.");
                }

                throw;
            }

            await _notificationService.CreateAsync(
                application.JobSeekerProfile.UserId,
                application.Id,
                "You have received a new contact request.");

            return MapRequest(request);
        }

        public async Task<List<ContactRequestDto>?> GetReceivedAsync(int userId)
        {
            var profile = await _jobSeekerRepository
                .GetByUserIdAsync(userId);

            if (profile == null)
            {
                return null;
            }

            var requests = await _contactRequestRepository
                .GetReceivedAsync(profile.Id);

            return requests.Select(MapRequest).ToList();
        }

        public async Task<List<ContactRequestDto>> GetSentAsync(
            int employerUserId)
        {
            var requests = await _contactRequestRepository
                .GetSentAsync(employerUserId);

            return requests.Select(MapRequest).ToList();
        }

        public Task<ContactRequestDto?> AcceptAsync(
            int requestId,
            int userId)
        {
            return UpdateStatusAsync(requestId, userId, "Accepted");
        }

        public Task<ContactRequestDto?> DeclineAsync(
            int requestId,
            int userId)
        {
            return UpdateStatusAsync(requestId, userId, "Declined");
        }

        private async Task<ContactRequestDto?> UpdateStatusAsync(
            int requestId,
            int userId,
            string status)
        {
            var profile = await _jobSeekerRepository
                .GetByUserIdAsync(userId);

            if (profile == null)
            {
                return null;
            }

            var request = await _contactRequestRepository
                .GetByIdAsync(requestId);

            if (request == null || request.JobSeekerProfileId != profile.Id)
            {
                return null;
            }

            if (!request.Status.Equals(
                "Pending",
                StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    "This contact request has already been answered.");
            }

            request.Status = status;
            request.UpdatedAt = DateTime.UtcNow;

            await _contactRequestRepository.UpdateAsync(request);

            await _notificationService.CreateAsync(
                request.EmployerUserId,
                request.ApplicationId,
                $"Your contact request has been {status.ToLowerInvariant()}.");

            return MapRequest(request);
        }

        private static ContactRequestDto MapRequest(ContactRequest request)
        {
            return new ContactRequestDto
            {
                Id = request.Id,
                ApplicationId = request.ApplicationId,
                JobTitle = request.Application.Vacancy.JobTitle,
                Message = request.Message,
                Status = request.Status,
                CreatedAt = request.CreatedAt,
                UpdatedAt = request.UpdatedAt
            };
        }
    }
}
