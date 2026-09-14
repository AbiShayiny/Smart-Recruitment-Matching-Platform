using Backend.DTOs.Contact;

namespace Backend.Services.Contact.Interfaces
{
    public interface IContactRequestService
    {
        Task<ContactRequestDto> SendAsync(
            int employerUserId,
            CreateContactRequestDto dto);

        Task<List<ContactRequestDto>?> GetReceivedAsync(int userId);

        Task<List<ContactRequestDto>> GetSentAsync(int employerUserId);

        Task<ContactRequestDto?> AcceptAsync(int requestId, int userId);

        Task<ContactRequestDto?> DeclineAsync(int requestId, int userId);
    }
}
