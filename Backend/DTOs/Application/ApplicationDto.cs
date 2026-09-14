namespace Backend.DTOs.Application
{
    public class ApplicationDto
    {
        public int Id { get; set; }

        public int VacancyId { get; set; }

        public string JobTitle { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime AppliedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
