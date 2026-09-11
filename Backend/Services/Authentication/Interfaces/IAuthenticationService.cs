using Backend.DTOs.Authentication;

namespace Backend.Services.Interfaces.Authentication
{
    public interface IAuthenticationService
    {
        string Register(RegisterRequest request);

        LoginResponse Login(LoginRequest request);
    }
}