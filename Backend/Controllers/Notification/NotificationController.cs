using System.Security.Claims;
using Backend.Services.Notification.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Notification
{
    [ApiController]
    [Route("api/notification")]
    [Authorize(Roles = "JobSeeker,Employer")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var notifications = await _notificationService
                .GetByUserIdAsync(userId.Value);

            return Ok(notifications);
        }

        [HttpPut("{notificationId}/read")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var notification = await _notificationService
                .MarkAsReadAsync(notificationId, userId.Value);

            if (notification == null)
            {
                return NotFound("Notification not found.");
            }

            return Ok(notification);
        }

        private int? GetCurrentUserId()
        {
            var value = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(value, out var userId)
                ? userId
                : null;
        }
    }
}
