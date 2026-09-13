using Backend.DTOs.Admin;

namespace Backend.Services.Interfaces.Admin
{
    public interface IAdminService
    {
        DashboardResponseDto GetDashboard();

        object GetAllUsers();

        string UpdateUser(int id, UpdateUserRequest request);

        string DeleteUser(int id);
    }
}
