using Backend.DTOs.Authentication;
using Backend.Models.User;
using Backend.Repositories.User.Interfaces;
using Backend.Services.Authentication.Interfaces;
using BCrypt.Net;

namespace Backend.Services.Authentication.Implementations
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;

        public AuthenticationService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> RegisterAsync(RegisterDto registerDto)
        {
            // 1. Check whether the email already exists
            var existingUser =
                await _userRepository.GetByEmailAsync(registerDto.Email);

            if (existingUser != null)
            {
                return false;
            }

            // 2. Hash the password
            string passwordHash =
                BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // 3. Create a User object
            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                Role = registerDto.Role
            };

            // 4. Save the user to the database
            await _userRepository.CreateAsync(user);

            // 5. Registration successful
            return true;
        }

        public async Task<bool> LoginAsync(LoginDto loginDto)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            // User not found
            if (user == null)
            {
                return false;
            }

            // Check password
            bool passwordValid = BCrypt.Net.BCrypt.Verify(
                loginDto.Password,
                user.PasswordHash
            );

            if (!passwordValid)
            {
                return false;
            }

            return true;
        }
    }
}