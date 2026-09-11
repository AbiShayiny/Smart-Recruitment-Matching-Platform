using Backend.DTOs.Admin;
using Backend.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrator")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            return Ok(_adminService.GetAllUsers());
        }

        [HttpPut("users/{id}")]
        public IActionResult UpdateUser(int id, UpdateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string result = _adminService.UpdateUser(id, request);

            if (result == "User not found")
            {
                return NotFound(result);
            }

            if (result == "Invalid role")
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("users/{id}")]
        public IActionResult DeleteUser(int id)
        {
            string result = _adminService.DeleteUser(id);

            if (result == "User not found")
            {
                return NotFound(result);
            }

            return Ok(result);
        }
    }
}