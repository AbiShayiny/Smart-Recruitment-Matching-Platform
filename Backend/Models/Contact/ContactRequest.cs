using System.ComponentModel.DataAnnotations;
using Backend.Models.Application;
using Backend.Models.JobSeeker;

namespace Backend.Models.Contact
{
    public class ContactRequest
    {
        public int Id { get; set; }

        public int EmployerUserId { get; set; }

        public int JobSeekerProfileId { get; set; }

        public int ApplicationId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Backend.Models.User.User EmployerUser { get; set; } = null!;

        public JobSeekerProfile JobSeekerProfile { get; set; } = null!;

        public JobApplication Application { get; set; } = null!;
    }
}
