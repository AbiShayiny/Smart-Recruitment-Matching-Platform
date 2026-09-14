using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Company
{
    public class UpdateCompanyDto
    {
        [Required]
        [MaxLength(150)]
        public string CompanyName { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Industry { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [MaxLength(250)]
        public string? Website { get; set; }

        [MaxLength(150)]
        [EmailAddress]
        public string? ContactEmail { get; set; }

        [MaxLength(30)]
        public string? ContactPhone { get; set; }
    }
}