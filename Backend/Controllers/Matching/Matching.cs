namespace Backend.Controllers.Matching
{
    [Microsoft.AspNetCore.Mvc.ApiController]
    [Microsoft.AspNetCore.Mvc.Controller]
    [Microsoft.AspNetCore.Mvc.Route("api/matching")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "JobSeeker")]
    public class Matching : Microsoft.AspNetCore.Mvc.ControllerBase
    {
        private readonly Backend.Services.Matching.Interfaces.IMatchingService
            _matchingService;

        public Matching(
            Backend.Services.Matching.Interfaces.IMatchingService matchingService)
        {
            _matchingService = matchingService;
        }

        [Microsoft.AspNetCore.Mvc.HttpGet("{userId}/{vacancyId}")]
        public async Task<Microsoft.AspNetCore.Mvc.IActionResult> GetMatch(
            int userId,
            int vacancyId)
        {
            var userIdClaim =
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var authenticatedUserId))
            {
                return Unauthorized();
            }

            if (authenticatedUserId != userId)
            {
                return Forbid();
            }

            var result = await _matchingService
                .CalculateMatchAsync(userId, vacancyId);

            if (result == null)
            {
                return NotFound(
                    "Job seeker profile or vacancy not found.");
            }

            return Ok(result);
        }
    }
}
