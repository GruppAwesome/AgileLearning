using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Grade
    {
        public String course_name { get; set; }

        public String task_info { get; set; }

        public String result_task { get; set; }

        public String exam_info { get; set; }

         public String result_exam { get; set; }

         public String final_info { get; set; }

         public String result_final { get; set; }

         public String result_coursegrade { get; set; }

         public String result_coursestatus { get; set; }

    }
}