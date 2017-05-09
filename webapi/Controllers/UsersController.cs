using WebAPI.Repositories;
using WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace WebAPI.Controllers
{



    [Route("api/[controller]")]
    public class UsersController
    {
        public static byte[] GetHash(string inputString)
        {
            HashAlgorithm algorithm = SHA1.Create();  //or use SHA1.Create();
            return algorithm.ComputeHash(Encoding.UTF8.GetBytes(inputString));
        }

        public static string GetHashString(string inputString)
        {
            StringBuilder sb = new StringBuilder();
            foreach (byte b in GetHash(inputString))
                sb.Append(b.ToString("X2"));

            return sb.ToString();
        }


        private IUserRepository userRepo;

        public UsersController(IUserRepository userRepo)
        {
            this.userRepo = userRepo;
        }

        // GET api/values
        [HttpGet]
        public IList<User> GetUsers()
        {
            return this.userRepo.Users().ToList();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public User Get(int id)
        {
            return this.userRepo.UserById(id);
        }


        public struct LoginArgs
        {
            public string Username;
            public string Password;
        }

        [HttpPost("login")]
        public User Login([FromBody] LoginArgs args)
        {

            var hash = GetHashString("tomat");

            Console.WriteLine(GetHashString("tomat"));
            var user = this.userRepo.LoginUser(args.Username, GetHashString(args.Password));
            return user;
        }

    }
}