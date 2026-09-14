using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Application
{
    public class UpdateApplicationStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
