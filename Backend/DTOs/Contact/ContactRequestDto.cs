namespace Backend.DTOs.Contact
{
    public class ContactRequestDto
    {
        public int Id { get; set; }

        public int ApplicationId { get; set; }

        public string JobTitle { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
