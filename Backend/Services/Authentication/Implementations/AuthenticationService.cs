using Backend.DTOs.Authentication;
using Backend.Models.User;
using Backend.Repositories.Interfaces.User;
using Backend.Services.Interfaces.Authentication;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services.Implementations.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthenticationService(
            IUserRepository userRepository,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public string Register(RegisterRequest request)
        {
            User existingUser = _userRepository.GetUserByEmail(request.Email);

            if (existingUser != null)
            {
                return "Email already exists";
            }

            if (request.Role != "JobSeeker" &&
                request.Role != "Employer")
            {
                return "Invalid role";
            }

            User user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role
            };

            _userRepository.AddUser(user);

            return "Registration successful";
        }

        public LoginResponse Login(LoginRequest request)
        {
            User user = _userRepository.GetUserByEmail(request.Email);

            if (user == null)
            {
                return null;
            }

            bool passwordIsCorrect =
                BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!passwordIsCorrect)
            {
                return null;
            }

            string token = GenerateToken(user);

            return new LoginResponse
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }

        private string GenerateToken(User user)
        {
            string key = _configuration["Jwt:Key"];

            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key));

            var credentials = new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}