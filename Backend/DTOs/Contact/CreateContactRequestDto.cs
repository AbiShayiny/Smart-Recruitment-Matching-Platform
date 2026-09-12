using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Contact
{
    public class CreateContactRequestDto
    {
        [Required]
        public int ApplicationId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;
    }
}
