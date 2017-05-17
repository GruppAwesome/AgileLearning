using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class User 
    {
        public int user_id { get; set; }
        public string user_name { get; set; }

        public string first_name { get; set; }
        public string last_name { get; set; }
        public string email { get; set; }

        public Nullable<int> age { get; set; }

        [JsonIgnore]
        public string password { get; set; }
    }
}