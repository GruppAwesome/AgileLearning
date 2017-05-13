using WebAPI.Repositories;
using WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Dapper;

namespace WebAPI.Controllers
{



    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        public static byte[] GetHash(string inputString)
        {
            HashAlgorithm algorithm = SHA1.Create();
            return algorithm.ComputeHash(Encoding.UTF8.GetBytes(inputString));
        }

        public static string GetHashString(string inputString)
        {
            StringBuilder sb = new StringBuilder();
            foreach (byte b in GetHash(inputString))
                sb.Append(b.ToString("X2"));

            return sb.ToString();
        }


        private IDatabaseConnection dbConn;

        public UsersController(IDatabaseConnection conn)
        {
            this.dbConn = conn;
        }

        // GET api/values
        [HttpGet]
           public IEnumerable<User> Get()
        {
            return dbConn.Conn.Query<User>(
                 "select * from users");
        }




        public struct LoginArgs
        {
            public string Username;
            public string Password;
        }

        [HttpPost("login")]
        public User Login([FromBody] LoginArgs args)
        {
            var user = this.LoginUser(args.Username, GetHashString(args.Password));
            return user;
        }

           public User LoginUser(string username, string password)
        {
            // Vulnerable to SQL Injection? Very possible
            return dbConn.Conn.QuerySingleOrDefault<User>(
                $"select * from users where \"Password\" is not null and \"Username\" = '{username}' and \"Password\" = '{password}'");
        }
        

    }
}
