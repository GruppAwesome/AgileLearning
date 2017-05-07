using Npgsql;
using System.Collections.Generic;
using Dapper;

using WebAPI.Models;

namespace WebAPI.Repositories 
{

    public interface IUserRepository
    {
        IEnumerable<User> Users();
        User UserById(int id);
        User LoginUser(string username, string password);
    }


    public class UserRepository : IUserRepository
    {

        private IDatabaseConnection dbConn;

        public UserRepository(IDatabaseConnection conn) 
        {
            this.dbConn = conn;
        }


        public IEnumerable<User> Users() 
        {
             return dbConn.Conn.Query<User>(
                 "select * from users");
        }


        public User LoginUser(string username, string password)
        {
            // Vulnerable to SQL Injection? Very possible
            return dbConn.Conn.QuerySingleOrDefault<User>(
                $"select * from users where \"Password\" is not null and \"Username\" = '{username}' and \"Password\" = '{password}'");
        }


        public User UserById(int id) 
        {
            return dbConn.Conn.QuerySingle<User>($"select * from users where id = {id}");
        }
    }
}