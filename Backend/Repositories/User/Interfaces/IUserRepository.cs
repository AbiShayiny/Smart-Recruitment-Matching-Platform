using UserModel = Backend.Models.User.User;

namespace Backend.Repositories.User.Interfaces
{
    public interface IUserRepository
    {
        Task<UserModel?> GetByEmailAsync(string email);

        Task<UserModel> CreateAsync(UserModel user);
    }
}