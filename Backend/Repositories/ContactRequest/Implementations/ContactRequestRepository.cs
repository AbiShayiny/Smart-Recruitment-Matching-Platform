using Backend.Data;
using Backend.Repositories.ContactRequest.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.ContactRequest.Implementations
{
    public class ContactRequestRepository : IContactRequestRepository
    {
        private readonly AppDbContext _context;

        public ContactRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Models.Contact.ContactRequest?> GetByIdAsync(
            int requestId)
        {
            return await _context.ContactRequests
                .Include(request => request.Application)
                    .ThenInclude(application => application.Vacancy)
                .FirstOrDefaultAsync(request => request.Id == requestId);
        }

        public async Task<bool> ExistsAsync(
            int employerUserId,
            int jobSeekerProfileId,
            int applicationId)
        {
            return await _context.ContactRequests.AnyAsync(request =>
                request.EmployerUserId == employerUserId &&
                request.JobSeekerProfileId == jobSeekerProfileId &&
                request.ApplicationId == applicationId);
        }

        public async Task<Models.Contact.ContactRequest> CreateAsync(
            Models.Contact.ContactRequest request)
        {
            await _context.ContactRequests.AddAsync(request);
            await _context.SaveChangesAsync();

            return request;
        }

        public async Task<List<Models.Contact.ContactRequest>> GetReceivedAsync(
            int jobSeekerProfileId)
        {
            return await _context.ContactRequests
                .Include(request => request.Application)
                    .ThenInclude(application => application.Vacancy)
                .Where(request =>
                    request.JobSeekerProfileId == jobSeekerProfileId)
                .OrderByDescending(request => request.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Models.Contact.ContactRequest>> GetSentAsync(
            int employerUserId)
        {
            return await _context.ContactRequests
                .Include(request => request.Application)
                    .ThenInclude(application => application.Vacancy)
                .Where(request => request.EmployerUserId == employerUserId)
                .OrderByDescending(request => request.CreatedAt)
                .ToListAsync();
        }

        public async Task<Models.Contact.ContactRequest> UpdateAsync(
            Models.Contact.ContactRequest request)
        {
            _context.ContactRequests.Update(request);
            await _context.SaveChangesAsync();

            return request;
        }
    }
}
