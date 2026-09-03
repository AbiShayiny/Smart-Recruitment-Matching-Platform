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

        public async Task<Models.Employer.Company> CreateAsync(
            Models.Employer.Company company)
        {
            _context.Companies.Add(company);

            await _context.SaveChangesAsync();

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