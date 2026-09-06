using Backend.DTOs.Vacancy;

namespace Backend.Services.Vacancy.Interfaces
{
    public interface IVacancyService
    {
        Task<Backend.Models.Vacancy.Vacancy> CreateAsync(
            CreateVacancyDto dto);

        Task<List<Backend.Models.Vacancy.Vacancy>> GetByCompanyIdAsync(
            int companyId);

        Task<Backend.Models.Vacancy.Vacancy?> GetByIdAsync(
            int vacancyId);

        Task<bool> UpdateAsync(
    int vacancyId,
    UpdateVacancyDto dto);

        Task<bool> CloseAsync(int vacancyId);
    }
}