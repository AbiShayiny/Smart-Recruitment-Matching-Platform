using Backend.DTOs.Authentication;

namespace Backend.Services.Authentication.Interfaces
{
    public interface IAuthenticationService
    {
        Task<bool> RegisterAsync(RegisterDto registerDto);

        Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
    }
}