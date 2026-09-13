using Backend.Data;
using Backend.Models.Employer;
using Backend.Repositories.Company.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Company.Implementations
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly AppDbContext _context;

        public CompanyRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Models.Employer.Company?> CreateAsync(
            Models.Employer.Company company, int employerUserId)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            // The conditional update prevents concurrent requests from linking two companies.
            var associated = await _context.Users
                .Where(user => user.Id == employerUserId && user.Role == "Employer" && user.CompanyId == null)
                .ExecuteUpdateAsync(update => update.SetProperty(user => user.CompanyId, (int?)company.CompanyId));

            if (associated != 1)
            {
                await transaction.RollbackAsync();
                return null;
            }

            await transaction.CommitAsync();
            return company;
        }

        public async Task<Models.Employer.Company?> GetByIdAsync(
    int companyId)
        {
            return await _context.Companies
                .FirstOrDefaultAsync(c => c.CompanyId == companyId);
        }

        public async Task<bool> UpdateAsync(
    Models.Employer.Company company)
        {
            _context.Companies.Update(company);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}