using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Feedback
    {
        public int user_id { get; set; }
        public string feedback_id { get; set; }

        public string feedback_date { get; set; }

        public int feedback_vote { get; set; }

        public string feedback_uid { get; set; }
    }
}