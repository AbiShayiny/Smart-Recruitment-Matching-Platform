using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Vacancy
{
    public class Vacancy
    {
        [Key]
        public int VacancyId { get; set; }

        [Required]
        public int CompanyId { get; set; }

        [Required]
        [MaxLength(150)]
        public string JobTitle { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string JobDescription { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string RequiredSkills { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? RequiredExperience { get; set; }

        [MaxLength(150)]
        public string? Education { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [MaxLength(50)]
        public string? EmploymentType { get; set; }

        public DateTime? ClosingDate { get; set; }

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "Open";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}