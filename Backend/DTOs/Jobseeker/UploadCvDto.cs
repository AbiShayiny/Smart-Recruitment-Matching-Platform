using Microsoft.AspNetCore.Http;

namespace Backend.DTOs.Jobseeker
{
    public class UploadCvDto
    {
        public IFormFile CvFile { get; set; } = null!;
    }
}