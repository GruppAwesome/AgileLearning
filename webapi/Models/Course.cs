using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Course 
    {
        public int id { get; set; }

        public String course_name { get; set; }

        public int user_id { get; set; }

        public String course_status { get; set; }

    }
}