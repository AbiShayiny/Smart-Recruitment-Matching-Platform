using System.Security.Claims;
using Backend.DTOs.Contact;
using Backend.Services.Contact.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Contact
{
    [ApiController]
    [Route("api/contact-request")]
    [Authorize]
    public class ContactRequestController : ControllerBase
    {
        private readonly IContactRequestService _contactRequestService;

        public ContactRequestController(
            IContactRequestService contactRequestService)
        {
            _contactRequestService = contactRequestService;
        }

        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> Send(
            [FromBody] CreateContactRequestDto dto)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            try
            {
                var request = await _contactRequestService
                    .SendAsync(userId.Value, dto);

                return Ok(request);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpGet("sent")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetSent()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var requests = await _contactRequestService
                .GetSentAsync(userId.Value);

            return Ok(requests);
        }

        [HttpGet("received")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> GetReceived()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var requests = await _contactRequestService
                .GetReceivedAsync(userId.Value);

            if (requests == null)
            {
                return NotFound("Job seeker profile not found.");
            }

            return Ok(requests);
        }

        [HttpPut("{requestId}/accept")]
        [Authorize(Roles = "JobSeeker")]
        public Task<IActionResult> Accept(int requestId)
        {
            return UpdateStatus(requestId, true);
        }

        [HttpPut("{requestId}/decline")]
        [Authorize(Roles = "JobSeeker")]
        public Task<IActionResult> Decline(int requestId)
        {
            return UpdateStatus(requestId, false);
        }

        private async Task<IActionResult> UpdateStatus(
            int requestId,
            bool accept)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            try
            {
                var request = accept
                    ? await _contactRequestService.AcceptAsync(
                        requestId,
                        userId.Value)
                    : await _contactRequestService.DeclineAsync(
                        requestId,
                        userId.Value);

                if (request == null)
                {
                    return NotFound("Contact request not found.");
                }

                return Ok(request);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
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
