using Backend.DTOs.Authentication;

namespace Backend.Services.Authentication.Interfaces
{
    public interface IAuthenticationService
    {
        Task<bool> RegisterAsync(RegisterDto registerDto);

        Task<bool> LoginAsync(LoginDto loginDto);
    }
}