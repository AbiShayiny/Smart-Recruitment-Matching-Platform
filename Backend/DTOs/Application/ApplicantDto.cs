namespace Backend.DTOs.Application
{
    public class ApplicantDto
    {
        public int ApplicationId { get; set; }

        public int JobSeekerProfileId { get; set; }

        public string Skills { get; set; } = string.Empty;

        public string Experience { get; set; } = string.Empty;

        public string Education { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime AppliedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public decimal? MatchScore { get; set; }
    }
}
