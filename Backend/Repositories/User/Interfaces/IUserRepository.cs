using UserModel = Backend.Models.User.User;

namespace Backend.Repositories.User.Interfaces
{
    public interface IUserRepository
    {
        Task<UserModel?> GetByEmailAsync(string email);

        Task<UserModel> CreateAsync(UserModel user);

        Task<List<UserModel>> GetAllAsync();

        Task<UserModel?> GetByIdAsync(int id);

        Task<UserModel?> UpdateAsync(int id, UserModel user);

        Task<bool> DeleteAsync(int id);
    }
}