using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Assignment
    {
        public string course_name { get; set; }

        public String exam_info { get; set; }

        public String task_info { get; set; }

        public String final_info { get; set; }
    }
}