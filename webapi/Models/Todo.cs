using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Todo
    {
        public string user_name { get; set; }

        public String course_name { get; set; }

        public String task_info { get; set; }

        public String task_describe { get; set; }

        public String task_time { get; set; }

        public String final_info { get; set; }

        public String final_describe { get; set; }

        public String final_time { get; set; }

        public String result_coursestatus { get; set; }
    }
}