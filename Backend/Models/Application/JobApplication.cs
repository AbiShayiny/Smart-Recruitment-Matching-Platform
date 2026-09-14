using System.ComponentModel.DataAnnotations;
using Backend.Models.JobSeeker;

namespace Backend.Models.Application
{
    public class JobApplication
    {
        public int Id { get; set; }

        public int JobSeekerProfileId { get; set; }

        public int VacancyId { get; set; }

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "Pending";

        public DateTime AppliedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public JobSeekerProfile JobSeekerProfile { get; set; } = null!;

        public Backend.Models.Vacancy.Vacancy Vacancy { get; set; } = null!;
    }
}
