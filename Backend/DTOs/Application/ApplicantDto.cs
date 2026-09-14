namespace Backend.DTOs.Application
{
    public class ApplicantDto
    {
        public int ApplicationId { get; set; }

        public int JobSeekerProfileId { get; set; }

        public int VacancyId { get; set; }

        public string JobTitle { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string ProfessionalTitle { get; set; } = string.Empty;

        public string ProfessionalSummary { get; set; } = string.Empty;

        public string Skills { get; set; } = string.Empty;

        public string Experience { get; set; } = string.Empty;

        public string Education { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime AppliedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public decimal? MatchScore { get; set; }

        public List<string> MatchedSkills { get; set; } = new();

        public List<string> MissingSkills { get; set; } = new();
    }
}
