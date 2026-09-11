using Backend.Data;
using UserModel = Backend.Models.User.User;
using Backend.Repositories.Interfaces.User;

namespace Backend.Repositories.Implementations.User
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public UserModel? GetUserByEmail(string email)
        {
            return _context.Users.FirstOrDefault(x => x.Email == email);
        }

        public UserModel? GetUserById(int id)
        {
            return _context.Users.FirstOrDefault(x => x.Id == id);
        }

        public List<UserModel> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public void AddUser(UserModel user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void UpdateUser(UserModel user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void DeleteUser(UserModel user)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
    }
}