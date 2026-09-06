using Backend.DTOs.Jobseeker;
using Backend.Services.Jobseeker.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Jobseeker
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobSeekerController : ControllerBase
    {
        private readonly IJobSeekerService _service;

        public JobSeekerController(IJobSeekerService service)
        {
            _service = service;
        }

        // Get Job Seeker Profile
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var profile = await _service.GetProfileAsync(userId);

            if (profile == null)
            {
                return NotFound("Job seeker profile not found.");
            }

            return Ok(profile);
        }

        // Create Job Seeker Profile
        [HttpPost("{userId}")]
        public async Task<IActionResult> CreateProfile(
            int userId,
            JobSeekerProfileDto dto)
        {
            try
            {
                var profile =
                    await _service.CreateProfileAsync(userId, dto);

                return Ok(profile);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Update Job Seeker Profile
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateProfile(
            int userId,
            JobSeekerProfileDto dto)
        {
            var profile =
                await _service.UpdateProfileAsync(userId, dto);

            if (profile == null)
            {
                return NotFound("Job seeker profile not found.");
            }

            return Ok(profile);
        }

        // Upload Job Seeker CV
        [HttpPost("{userId}/cv")]
        public async Task<IActionResult> UploadCv(
            int userId,
            [FromForm] UploadCvDto dto)
        {
            try
            {
                var result =
                    await _service.UploadCvAsync(userId, dto);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}