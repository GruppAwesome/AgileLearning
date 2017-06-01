using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Weeklyfeedback
    {
        public int weekly_q1 { get; set; }

        public int weekly_q2 { get; set; }

        public int weekly_q3 { get; set; }

        public String class_name { get; set; }

        public int weekly_week { get; set; }

        public int weekly_uid { get; set; }

        public string weekly_free_text1 { get; set;}

        public string weekly_free_text2 { get; set;}
    }
}