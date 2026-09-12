namespace Backend.DTOs.Matching
{
    public class MatchingResultDto
    {
        public decimal MatchScore { get; set; }
        public decimal SkillScore { get; set; }
        public decimal ExperienceScore { get; set; }
        public decimal EducationScore { get; set; }
        public decimal LocationScore { get; set; }
        public decimal OtherScore { get; set; }
        public decimal? CvProfileConsistencyScore { get; set; }
        public decimal ProfileCompletenessScore { get; set; }
        public decimal ProfileMaintenanceScore { get; set; }
        public List<string> MatchedSkills { get; set; } = new List<string>();
        public List<string> MissingSkills { get; set; } = new List<string>();
    }
}
