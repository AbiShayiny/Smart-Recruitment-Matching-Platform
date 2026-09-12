using Backend.Models.Notification;

namespace Backend.Repositories.Notification.Interfaces
{
    public interface INotificationRepository
    {
        Task<Models.Notification.Notification> CreateAsync(
            Models.Notification.Notification notification);

        Task<List<Models.Notification.Notification>> GetByUserIdAsync(
            int userId);

        Task<Models.Notification.Notification?> GetByIdAsync(
            int notificationId);

        Task<Models.Notification.Notification> UpdateAsync(
            Models.Notification.Notification notification);
    }
}
