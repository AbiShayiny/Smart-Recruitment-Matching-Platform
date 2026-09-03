using Backend.DTOs.Vacancy;
using Backend.Services.Vacancy.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Employer
{
    [ApiController]
    [Route("api/employer/vacancy")]
    public class VacancyController : ControllerBase
    {
        private readonly IVacancyService _vacancyService;

        public VacancyController(
            IVacancyService vacancyService)
        {
            _vacancyService = vacancyService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVacancy(
            [FromBody] CreateVacancyDto dto)
        {
            var vacancy =
                await _vacancyService.CreateAsync(dto);

            return Ok(vacancy);
        }

        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetMyVacancies(
            int companyId)
        {
            var vacancies =
                await _vacancyService
                    .GetByCompanyIdAsync(companyId);

            return Ok(vacancies);
        }

        [HttpGet("{vacancyId}")]
        public async Task<IActionResult> GetVacancy(int vacancyId)
        {
            var vacancy = await _vacancyService.GetByIdAsync(vacancyId);

            if (vacancy == null)
            {
                return NotFound(new
                {
                    message = "Vacancy not found"
                });
            }

            return Ok(vacancy);
        }

        [HttpPut("{vacancyId}")]
        public async Task<IActionResult> UpdateVacancy(
    int vacancyId,
    [FromBody] UpdateVacancyDto dto)
        {
            var updated = await _vacancyService
                .UpdateAsync(vacancyId, dto);

            if (!updated)
            {
                return NotFound(new
                {
                    message = "Vacancy not found"
                });
            }

            return Ok(new
            {
                message = "Vacancy updated successfully"
            });
        }

        [HttpPut("{vacancyId}/close")]
        public async Task<IActionResult> CloseVacancy(
    int vacancyId)
        {
            var closed = await _vacancyService
                .CloseAsync(vacancyId);

            if (!closed)
            {
                return NotFound(new
                {
                    message = "Vacancy not found"
                });
            }

            return Ok(new
            {
                message = "Vacancy closed successfully"
            });
        }
    }
}