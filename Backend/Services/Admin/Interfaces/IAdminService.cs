using Backend.DTOs.Admin;

namespace Backend.Services.Interfaces.Admin
{
    public interface IAdminService
    {
        object GetAllUsers();

        string UpdateUser(int id, UpdateUserRequest request);

        string DeleteUser(int id);
    }
}