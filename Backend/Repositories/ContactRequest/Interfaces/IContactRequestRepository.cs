using Backend.Models.Contact;

namespace Backend.Repositories.ContactRequest.Interfaces
{
    public interface IContactRequestRepository
    {
        Task<Models.Contact.ContactRequest?> GetByIdAsync(int requestId);

        Task<bool> ExistsAsync(
            int employerUserId,
            int jobSeekerProfileId,
            int applicationId);

        Task<Models.Contact.ContactRequest> CreateAsync(
            Models.Contact.ContactRequest request);

        Task<List<Models.Contact.ContactRequest>> GetReceivedAsync(
            int jobSeekerProfileId);

        Task<List<Models.Contact.ContactRequest>> GetSentAsync(
            int employerUserId);

        Task<Models.Contact.ContactRequest> UpdateAsync(
            Models.Contact.ContactRequest request);
    }
}
