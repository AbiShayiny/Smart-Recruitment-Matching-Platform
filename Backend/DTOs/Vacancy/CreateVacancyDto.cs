using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Vacancy
{
    public class CreateVacancyDto
    {
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
    }
}