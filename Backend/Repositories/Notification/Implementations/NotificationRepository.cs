using Backend.Data;
using Backend.Repositories.Notification.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Notification.Implementations
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Models.Notification.Notification> CreateAsync(
            Models.Notification.Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            return notification;
        }

        public async Task<List<Models.Notification.Notification>>
            GetByUserIdAsync(int userId)
        {
            return await _context.Notifications
                .Where(notification => notification.UserId == userId)
                .OrderByDescending(notification => notification.CreatedAt)
                .ToListAsync();
        }

        public async Task<Models.Notification.Notification?> GetByIdAsync(
            int notificationId)
        {
            return await _context.Notifications
                .FirstOrDefaultAsync(notification =>
                    notification.Id == notificationId);
        }

        public async Task<Models.Notification.Notification> UpdateAsync(
            Models.Notification.Notification notification)
        {
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();

            return notification;
        }
    }
}
