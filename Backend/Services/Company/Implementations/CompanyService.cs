using Backend.DTOs.Company;
using Backend.Models.Employer;
using Backend.Repositories.Company.Interfaces;
using Backend.Services.Company.Interfaces;

namespace Backend.Services.Company.Implementations
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;

        public CompanyService(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        public async Task<Models.Employer.Company> CreateAsync(
            CreateCompanyDto dto)
        {
            var company = new Models.Employer.Company
            {
                CompanyName = dto.CompanyName,
                Description = dto.Description,
                Industry = dto.Industry,
                Location = dto.Location,
                Website = dto.Website,
                ContactEmail = dto.ContactEmail,
                ContactPhone = dto.ContactPhone
            };

            return await _companyRepository.CreateAsync(company);
        }

        public async Task<Models.Employer.Company?> GetByIdAsync(
    int companyId)
        {
            return await _companyRepository.GetByIdAsync(companyId);
        }

        public async Task<bool> UpdateAsync(
    int companyId,
    UpdateCompanyDto dto)
        {
            var company = await _companyRepository.GetByIdAsync(companyId);

            if (company == null)
            {
                return false;
            }

            company.CompanyName = dto.CompanyName;
            company.Description = dto.Description;
            company.Industry = dto.Industry;
            company.Location = dto.Location;
            company.Website = dto.Website;
            company.ContactEmail = dto.ContactEmail;
            company.ContactPhone = dto.ContactPhone;
            company.UpdatedAt = DateTime.UtcNow;

            return await _companyRepository.UpdateAsync(company);
        }
    }
}