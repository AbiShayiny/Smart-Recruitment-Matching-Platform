using Backend.DTOs.Notification;
using Backend.Repositories.Notification.Interfaces;
using Backend.Services.Notification.Interfaces;

namespace Backend.Services.Notification.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(
            INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<NotificationDto> CreateAsync(
            int userId,
            int applicationId,
            string message)
        {
            var notification = new Models.Notification.Notification
            {
                UserId = userId,
                ApplicationId = applicationId,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationRepository.CreateAsync(notification);

            return MapNotification(notification);
        }

        public async Task<List<NotificationDto>> GetByUserIdAsync(
            int userId)
        {
            var notifications = await _notificationRepository
                .GetByUserIdAsync(userId);

            return notifications
                .Select(MapNotification)
                .ToList();
        }

        public async Task<NotificationDto?> MarkAsReadAsync(
            int notificationId,
            int userId)
        {
            var notification = await _notificationRepository
                .GetByIdAsync(notificationId);

            if (notification == null || notification.UserId != userId)
            {
                return null;
            }

            notification.IsRead = true;
            await _notificationRepository.UpdateAsync(notification);

            return MapNotification(notification);
        }

        private static NotificationDto MapNotification(
            Models.Notification.Notification notification)
        {
            return new NotificationDto
            {
                Id = notification.Id,
                ApplicationId = notification.ApplicationId,
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };
        }
    }
}
