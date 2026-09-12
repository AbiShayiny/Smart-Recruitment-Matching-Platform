using System.Security.Claims;
using Backend.DTOs.Application;
using Backend.Services.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Application
{
    [ApiController]
    [Route("api/application")]
    [Authorize]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpPost("vacancy/{vacancyId}/apply")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> Apply(int vacancyId)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            try
            {
                var application = await _applicationService
                    .ApplyAsync(userId.Value, vacancyId);

                return Ok(application);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpGet("my")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> GetMyApplications()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var applications = await _applicationService
                .GetMyApplicationsAsync(userId.Value);

            if (applications == null)
            {
                return NotFound("Job seeker profile not found.");
            }

            return Ok(applications);
        }

        [HttpGet("vacancy/{vacancyId}/applicants")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetApplicants(int vacancyId)
        {
            var applicants = await _applicationService
                .GetApplicantsAsync(vacancyId);

            if (applicants == null)
            {
                return NotFound("Vacancy not found.");
            }

            return Ok(applicants);
        }

        [HttpPut("{applicationId}/status")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UpdateStatus(
            int applicationId,
            [FromBody] UpdateApplicationStatusDto dto)
        {
            try
            {
                var application = await _applicationService
                    .UpdateStatusAsync(applicationId, dto.Status);

                if (application == null)
                {
                    return NotFound("Application not found.");
                }

                return Ok(application);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private int? GetCurrentUserId()
        {
            var value = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(value, out var userId)
                ? userId
                : null;
        }
    }
}
