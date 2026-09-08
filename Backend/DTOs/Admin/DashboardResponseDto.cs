namespace Backend.DTOs.Admin
{
    public class DashboardResponseDto
    {
        public int TotalUsers { get; set; }
        public int TotalCompanies { get; set; }
        public int TotalVacancies { get; set; }
        public int TotalApplications { get; set; }
    }
}