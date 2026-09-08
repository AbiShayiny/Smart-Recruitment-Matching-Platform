using Backend.DTOs.Authentication;
using Backend.Models.User;
using Backend.Repositories.User.Interfaces;
using Backend.Services.Authentication.Interfaces;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services.Authentication.Implementations
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

        public async Task<bool> RegisterAsync(RegisterDto registerDto)
        {
            var existingUser =
                await _userRepository.GetByEmailAsync(registerDto.Email);

            if (existingUser != null)
            {
                return false;
            }

            string passwordHash =
                BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                Role = registerDto.Role
            };

            await _userRepository.CreateAsync(user);

            return true;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var user =
                await _userRepository.GetByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return null;
            }

            bool passwordValid =
                BCrypt.Net.BCrypt.Verify(
                    loginDto.Password,
                    user.PasswordHash);

            if (!passwordValid)
            {
                return null;
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(
                        _configuration["Jwt:ExpiryMinutes"])),
                signingCredentials: credentials);

            var tokenString =
                new JwtSecurityTokenHandler().WriteToken(token);

            return new LoginResponseDto
            {
                Token = tokenString,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}