using Backend.Models.Employer;

namespace Backend.Repositories.Company.Interfaces
{
    public interface ICompanyRepository
    {
        Task<Models.Employer.Company> CreateAsync(
            Models.Employer.Company company);

        Task<Models.Employer.Company?> GetByIdAsync(
            int companyId);
    }
}