using Backend.DTOs.Authentication;
using Backend.Services.Authentication.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Athuentication
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(
            IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var result =
                await _authenticationService.RegisterAsync(registerDto);

            if (!result)
            {
                return BadRequest(new
                {
                    message = "Email already exists."
                });
            }

            return Ok(new
            {
                message = "Registration successful."
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var result =
                await _authenticationService.LoginAsync(loginDto);

            if (result == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            return Ok(result);
        }
    }
}