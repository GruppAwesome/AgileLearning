using WebAPI.Repositories;
using WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;


namespace WebAPI.Controllers 
{

    [Route("api/[controller]")]
    public class UsersController 
    {

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
            Console.WriteLine($"Got login request: Username: '{args.Username}' Password: '{args.Password}'");
            var user = this.userRepo.LoginUser(args.Username, args.Password);
            return user;
        }

    }
}