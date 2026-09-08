using Backend.DTOs.Admin;

namespace Backend.Services.Admin.Interfaces
{
    public interface IAdminService
    {
        Task<List<UserResponseDto>> GetAllUsersAsync();

        Task<UserResponseDto?> GetUserByIdAsync(int id);

        Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto);

        Task<bool> DeleteUserAsync(int id);

        Task<DashboardResponseDto> GetDashboardAsync();
    }
}