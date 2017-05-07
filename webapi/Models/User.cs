using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class User 
    {
        public int id { get; set; }
        public string Username { get; set; }

        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }

        public Nullable<int> Age { get; set; }

        [JsonIgnore]
        public string Password { get; set; }
    }
}