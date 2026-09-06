using Backend.DTOs.Vacancy;
using Backend.Repositories.Vacancy.Interfaces;
using Backend.Services.Vacancy.Interfaces;

namespace Backend.Services.Vacancy.Implementations
{
    public class VacancyService : IVacancyService
    {
        private readonly IVacancyRepository _vacancyRepository;

        public VacancyService(
            IVacancyRepository vacancyRepository)
        {
            _vacancyRepository = vacancyRepository;
        }

        public async Task<Backend.Models.Vacancy.Vacancy>
            CreateAsync(CreateVacancyDto dto)
        {
            var vacancy =
                new Backend.Models.Vacancy.Vacancy
                {
                    CompanyId = dto.CompanyId,
                    JobTitle = dto.JobTitle,
                    JobDescription = dto.JobDescription,
                    RequiredSkills = dto.RequiredSkills,
                    RequiredExperience = dto.RequiredExperience,
                    Education = dto.Education,
                    Location = dto.Location,
                    EmploymentType = dto.EmploymentType,
                    ClosingDate = dto.ClosingDate,
                    Status = "Open",
                    CreatedAt = DateTime.UtcNow
                };

            return await _vacancyRepository
                .CreateAsync(vacancy);
        }

        public async Task<List<Backend.Models.Vacancy.Vacancy>>
            GetByCompanyIdAsync(int companyId)
        {
            return await _vacancyRepository
                .GetByCompanyIdAsync(companyId);
        }

        public async Task<Backend.Models.Vacancy.Vacancy?> GetByIdAsync(
    int vacancyId)
        {
            return await _vacancyRepository.GetByIdAsync(vacancyId);
        }

        public async Task<bool> UpdateAsync(
    int vacancyId,
    UpdateVacancyDto dto)
        {
            var vacancy = await _vacancyRepository
                .GetByIdAsync(vacancyId);

            if (vacancy == null)
            {
                return false;
            }

            vacancy.JobTitle = dto.JobTitle;
            vacancy.JobDescription = dto.JobDescription;
            vacancy.RequiredSkills = dto.RequiredSkills;
            vacancy.RequiredExperience = dto.RequiredExperience;
            vacancy.Education = dto.Education;
            vacancy.Location = dto.Location;
            vacancy.EmploymentType = dto.EmploymentType;
            vacancy.ClosingDate = dto.ClosingDate;
            vacancy.UpdatedAt = DateTime.UtcNow;

            return await _vacancyRepository.UpdateAsync(vacancy);
        }

        public async Task<bool> CloseAsync(int vacancyId)
        {
            var vacancy = await _vacancyRepository
                .GetByIdAsync(vacancyId);

            if (vacancy == null)
            {
                return false;
            }

            vacancy.Status = "Closed";
            vacancy.UpdatedAt = DateTime.UtcNow;

            return await _vacancyRepository.UpdateAsync(vacancy);
        }
    }
}