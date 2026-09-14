using Backend.DTOs.Admin;
using Backend.Data;
using Backend.Models.User;
using Backend.Repositories.Interfaces.User;
using Backend.Services.Interfaces.Admin;

namespace Backend.Services.Implementations.Admin
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly AppDbContext _context;

        public AdminService(IUserRepository userRepository, AppDbContext context)
        {
            _userRepository = userRepository;
            _context = context;
        }

        public DashboardResponseDto GetDashboard()
        {
            return new DashboardResponseDto
            {
                TotalUsers = _context.Users.Count(),
                TotalCompanies = _context.Companies.Count(),
                TotalVacancies = _context.Vacancies.Count(),
                TotalApplications = _context.JobApplications.Count()
            };
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

            User existingUser = _userRepository.GetUserByEmail(request.Email);

            if (existingUser != null && existingUser.Id != id)
            {
                return "Email already exists";
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
