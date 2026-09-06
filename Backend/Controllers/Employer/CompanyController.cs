using Backend.DTOs.Company;
using Backend.Services.Company.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Employer
{
    [ApiController]
    [Route("api/employer/company")]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompany(
            [FromBody] CreateCompanyDto dto)
        {
            var company = await _companyService.CreateAsync(dto);

            return Ok(company);
        }

        [HttpGet("{companyId}")]
        public async Task<IActionResult> GetCompany(int companyId)
        {
            var company = await _companyService.GetByIdAsync(companyId);

            if (company == null)
            {
                return NotFound(new
                {
                    message = "Company not found"
                });
            }

            return Ok(company);
        }

        [HttpPut("{companyId}")]
        public async Task<IActionResult> UpdateCompany(
    int companyId,
    [FromBody] UpdateCompanyDto dto)
        {
            var updated = await _companyService.UpdateAsync(
                companyId,
                dto);

            if (!updated)
            {
                return NotFound(new
                {
                    message = "Company not found"
                });
            }

            return Ok(new
            {
                message = "Company updated successfully"
            });
        }
    }
}