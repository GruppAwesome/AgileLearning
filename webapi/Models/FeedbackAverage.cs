using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models
{

    public class FeedbackAverage
    {

        public string feedback_date { get; set; }

        public float Average { get; set; }

    }
}