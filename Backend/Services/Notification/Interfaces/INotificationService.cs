using Backend.DTOs.Notification;

namespace Backend.Services.Notification.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationDto> CreateAsync(
            int userId,
            int applicationId,
            string message);

        Task<List<NotificationDto>> GetByUserIdAsync(int userId);

        Task<NotificationDto?> MarkAsReadAsync(
            int notificationId,
            int userId);
    }
}
