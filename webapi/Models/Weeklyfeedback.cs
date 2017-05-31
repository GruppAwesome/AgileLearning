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
    }
}