using UserModel = Backend.Models.User.User;

namespace Backend.Repositories.Interfaces.User
{
    public interface IUserRepository
    {
        UserModel? GetUserByEmail(string email);

        UserModel? GetUserById(int id);

        List<UserModel> GetAllUsers();

        void AddUser(UserModel user);

        void UpdateUser(UserModel user);

        void DeleteUser(UserModel user);
    }
}