using Backend.DTOs.Authentication;
using Backend.Services.Interfaces.Authentication;
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
        public IActionResult Register(RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string result = _authenticationService.Register(request);

            if (result == "Email already exists")
            {
                return Conflict(result);
            }

            if (result == "Invalid role")
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            LoginResponse response = _authenticationService.Login(request);

            if (response == null)
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok(response);
        }
    }
}