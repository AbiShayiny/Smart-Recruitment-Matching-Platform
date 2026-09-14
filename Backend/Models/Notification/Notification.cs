using System.ComponentModel.DataAnnotations;
using Backend.Models.Application;

namespace Backend.Models.Notification
{
    public class Notification
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ApplicationId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Backend.Models.User.User User { get; set; } = null!;

        public JobApplication Application { get; set; } = null!;
    }
}
