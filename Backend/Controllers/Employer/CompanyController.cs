using System.Security.Claims;
using Backend.DTOs.Company;
using Backend.Repositories.Interfaces.User;
using Backend.Services.Company.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Employer
{
    [ApiController]
    [Authorize(Roles = "Employer")]
    [Route("api/employer/company")]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        private readonly IUserRepository _userRepository;

        public CompanyController(ICompanyService companyService, IUserRepository userRepository)
        {
            _companyService = companyService;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyDto dto)
        {
            var employer = GetCurrentEmployer();
            if (employer == null) return Unauthorized();
            if (employer.CompanyId != null)
                return Conflict(new { message = "Your account is already associated with a company." });

            var company = await _companyService.CreateAsync(dto, employer.Id);
            if (company == null)
                return Conflict(new { message = "The company association changed. Sign in again to refresh your account." });

            return Ok(company);
        }

        [HttpGet("{companyId}")]
        public async Task<IActionResult> GetCompany(int companyId)
        {
            var employer = GetCurrentEmployer();
            if (employer == null) return Unauthorized();
            if (employer.CompanyId != companyId) return Forbid();

            var company = await _companyService.GetByIdAsync(companyId);
            if (company == null) return NotFound(new { message = "Company not found" });
            return Ok(company);
        }

        [HttpPut("{companyId}")]
        public async Task<IActionResult> UpdateCompany(int companyId, [FromBody] UpdateCompanyDto dto)
        {
            var employer = GetCurrentEmployer();
            if (employer == null) return Unauthorized();
            if (employer.CompanyId != companyId) return Forbid();

            var updated = await _companyService.UpdateAsync(companyId, dto);
            if (!updated) return NotFound(new { message = "Company not found" });
            return Ok(new { message = "Company updated successfully" });
        }

        private Backend.Models.User.User? GetCurrentEmployer()
        {
            var value = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(value, out var userId) || userId <= 0) return null;
            var user = _userRepository.GetUserById(userId);
            return user?.Role == "Employer" ? user : null;
        }
    }
}
