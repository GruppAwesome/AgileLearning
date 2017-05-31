using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Presence
    {
        public int user_id { get; set;}
        public int coursecode_cid { get; set; }

        public string course_name {get; set;}

        public string coursecode_date { get; set; }


    }
}