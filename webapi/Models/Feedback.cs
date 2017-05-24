using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class Feedback
    {
        public string feedback_id { get; set; }

        public String feedback_date { get; set; }

        public String feedback_vote { get; set; }

        public String feedback_uid { get; set; }
    }
}