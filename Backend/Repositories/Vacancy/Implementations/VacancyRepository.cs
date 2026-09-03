using Backend.Data;
using Backend.Repositories.Vacancy.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Vacancy.Implementations
{
    public class VacancyRepository : IVacancyRepository
    {
        private readonly AppDbContext _context;

        public VacancyRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Backend.Models.Vacancy.Vacancy> CreateAsync(
            Backend.Models.Vacancy.Vacancy vacancy)
        {
            _context.Vacancies.Add(vacancy);

            await _context.SaveChangesAsync();

            return vacancy;
        }

        public async Task<List<Backend.Models.Vacancy.Vacancy>>
            GetByCompanyIdAsync(int companyId)
        {
            return await _context.Vacancies
                .Where(v => v.CompanyId == companyId)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();
        }

        public async Task<Backend.Models.Vacancy.Vacancy?> GetByIdAsync(
    int vacancyId)
        {
            return await _context.Vacancies
                .FirstOrDefaultAsync(v => v.VacancyId == vacancyId);
        }

        public async Task<bool> UpdateAsync(
    Backend.Models.Vacancy.Vacancy vacancy)
        {
            _context.Vacancies.Update(vacancy);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
