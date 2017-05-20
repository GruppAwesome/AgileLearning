using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Course 
    {
        public int course_id { get; set; }

        public String course_name { get; set; }

        public String course_status { get; set; }

        public String course_describe { get; set; }

         public String course_teacher { get; set; }

         public String course_exam { get; set; }

         public String course_task { get; set; }

         public int exam_id { get; set; }

         public String exam_info { get; set; }

         public String exam_grade { get; set; }

         public int task_id { get; set; }

         public String task_info { get; set; }

         public String task_grade { get; set; }
    }
}