namespace Backend.Repositories.Vacancy.Interfaces
{
    public interface IVacancyRepository
    {
        Task<Backend.Models.Vacancy.Vacancy> CreateAsync(
            Backend.Models.Vacancy.Vacancy vacancy);

        Task<List<Backend.Models.Vacancy.Vacancy>> GetByCompanyIdAsync(
            int companyId);

        Task<Backend.Models.Vacancy.Vacancy?> GetByIdAsync(
            int vacancyId);

        Task<List<Backend.Models.Vacancy.Vacancy>> GetOpenAsync();

        Task<bool> UpdateAsync(
            Backend.Models.Vacancy.Vacancy vacancy);
    }
}