using Backend.DTOs.Admin;
using Backend.Models.User;
using Backend.Repositories.Interfaces.User;
using Backend.Services.Interfaces.Admin;

namespace Backend.Services.Implementations.Admin
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;

        public AdminService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public object GetAllUsers()
        {
            var users = _userRepository.GetAllUsers();

            return users.Select(user => new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role
            }).ToList();
        }

        public string UpdateUser(int id, UpdateUserRequest request)
        {
            User user = _userRepository.GetUserById(id);

            if (user == null)
            {
                return "User not found";
            }

            if (request.Role != "JobSeeker" &&
                request.Role != "Employer" &&
                request.Role != "Administrator")
            {
                return "Invalid role";
            }

            user.Name = request.Name;
            user.Email = request.Email;
            user.Role = request.Role;

            _userRepository.UpdateUser(user);

            return "User updated successfully";
        }

        public string DeleteUser(int id)
        {
            User user = _userRepository.GetUserById(id);

            if (user == null)
            {
                return "User not found";
            }

            _userRepository.DeleteUser(user);

            return "User deleted successfully";
        }
    }
}