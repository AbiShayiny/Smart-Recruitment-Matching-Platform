using Backend.DTOs.Admin;
using Backend.Repositories.User.Interfaces;
using Backend.Services.Admin.Interfaces;

namespace Backend.Services.Admin.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;

        public AdminService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();

            return users.Select(user => new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            }).ToList();
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return null;
            }

            return new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserResponseDto?> UpdateUserAsync(
            int id,
            UpdateUserDto updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return null;
            }

            user.FullName = updateUserDto.FullName;
            user.Email = updateUserDto.Email;
            user.Role = updateUserDto.Role;

            var updatedUser =
                await _userRepository.UpdateAsync(id, user);

            if (updatedUser == null)
            {
                return null;
            }

            return new UserResponseDto
            {
                Id = updatedUser.Id,
                FullName = updatedUser.FullName,
                Email = updatedUser.Email,
                Role = updatedUser.Role,
                CreatedAt = updatedUser.CreatedAt
            };
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var result = await _userRepository.DeleteAsync(id);

            return result;
        }

        public async Task<DashboardResponseDto> GetDashboardAsync()
        {
            var users = await _userRepository.GetAllAsync();

            return new DashboardResponseDto
            {
                TotalUsers = users.Count
            };
        }
    }

}