using System.Security.Claims;
using Backend.DTOs.Vacancy;
using Backend.Repositories.Interfaces.User;
using Backend.Services.Vacancy.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Employer
{
    [ApiController]
    [Authorize]
    [Route("api/employer/vacancy")]
    public class VacancyController : ControllerBase
    {
        private readonly IVacancyService _vacancyService;
        private readonly IUserRepository _userRepository;

        public VacancyController(IVacancyService vacancyService, IUserRepository userRepository)
        {
            _vacancyService = vacancyService;
            _userRepository = userRepository;
        }

        [Authorize(Roles = "Employer,JobSeeker")]
        [HttpGet]
        public async Task<IActionResult> GetOpenVacancies()
        {
            return Ok(await _vacancyService.GetOpenAsync());
        }

        [Authorize(Roles = "Employer")]
        [HttpPost]
        public async Task<IActionResult> CreateVacancy([FromBody] CreateVacancyDto dto)
        {
            var companyId = GetCurrentCompanyId();
            if (companyId == null || dto.CompanyId != companyId.Value) return Forbid();

            // Ownership comes from the persisted user, never the submitted ID.
            dto.CompanyId = companyId.Value;
            var vacancy = await _vacancyService.CreateAsync(dto);
            return Ok(vacancy);
        }

        [Authorize(Roles = "Employer")]
        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetMyVacancies(int companyId)
        {
            if (GetCurrentCompanyId() != companyId) return Forbid();
            var vacancies = await _vacancyService.GetByCompanyIdAsync(companyId);
            return Ok(vacancies);
        }

        [Authorize(Roles = "Employer,JobSeeker")]
        [HttpGet("{vacancyId}")]
        public async Task<IActionResult> GetVacancy(int vacancyId)
        {
            if (User.IsInRole("JobSeeker"))
            {
                var jobSeekerVacancy = await _vacancyService.GetByIdAsync(vacancyId);
                if (jobSeekerVacancy == null ||
                    !string.Equals(jobSeekerVacancy.Status, "Open", StringComparison.OrdinalIgnoreCase))
                    return NotFound(new { message = "Vacancy not found" });
                return Ok(jobSeekerVacancy);
            }

            var companyId = GetCurrentCompanyId();
            if (companyId == null) return Forbid();
            var vacancy = await _vacancyService.GetByIdAsync(vacancyId);
            if (vacancy == null || vacancy.CompanyId != companyId.Value)
                return NotFound(new { message = "Vacancy not found" });
            return Ok(vacancy);
        }

        [Authorize(Roles = "Employer")]
        [HttpPut("{vacancyId}")]
        public async Task<IActionResult> UpdateVacancy(int vacancyId, [FromBody] UpdateVacancyDto dto)
        {
            var companyId = GetCurrentCompanyId();
            if (companyId == null) return Forbid();
            var vacancy = await _vacancyService.GetByIdAsync(vacancyId);
            if (vacancy == null || vacancy.CompanyId != companyId.Value)
                return NotFound(new { message = "Vacancy not found" });

            var updated = await _vacancyService.UpdateAsync(vacancyId, dto);
            if (!updated) return NotFound(new { message = "Vacancy not found" });
            return Ok(new { message = "Vacancy updated successfully" });
        }

        [Authorize(Roles = "Employer")]
        [HttpPut("{vacancyId}/close")]
        public async Task<IActionResult> CloseVacancy(int vacancyId)
        {
            var companyId = GetCurrentCompanyId();
            if (companyId == null) return Forbid();
            var vacancy = await _vacancyService.GetByIdAsync(vacancyId);
            if (vacancy == null || vacancy.CompanyId != companyId.Value)
                return NotFound(new { message = "Vacancy not found" });

            var closed = await _vacancyService.CloseAsync(vacancyId);
            if (!closed) return NotFound(new { message = "Vacancy not found" });
            return Ok(new { message = "Vacancy closed successfully" });
        }

        private int? GetCurrentCompanyId()
        {
            var value = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(value, out var userId) || userId <= 0) return null;
            var user = _userRepository.GetUserById(userId);
            return user?.Role == "Employer" ? user.CompanyId : null;
        }
    }
}
