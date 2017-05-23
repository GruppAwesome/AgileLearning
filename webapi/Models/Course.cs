using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Course 
    {

        public String course_name { get; set; }

        public String result_coursestatus { get; set; }

        public String course_describe { get; set; }

         public String course_teacher { get; set; }

         public String course_goal { get; set; }
         


    }
}