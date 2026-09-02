namespace Backend.Models.JobSeeker
{
    public class JobSeekerProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Skills { get; set; } = string.Empty;

        public string Experience { get; set; } = string.Empty;

        public string Education { get; set; } = string.Empty;
    }
}