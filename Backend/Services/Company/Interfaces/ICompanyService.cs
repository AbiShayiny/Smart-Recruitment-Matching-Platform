using Backend.DTOs.Company;
using Backend.Models.Employer;

namespace Backend.Services.Company.Interfaces
{
    public interface ICompanyService
    {
        Task<Models.Employer.Company> CreateAsync(
            CreateCompanyDto dto);

        Task<Models.Employer.Company?> GetByIdAsync(
            int companyId);
    }
}