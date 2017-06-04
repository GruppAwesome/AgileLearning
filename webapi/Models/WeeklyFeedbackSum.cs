using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models
{

    public class WeeklyFeedbackSum
    {

        public int weekly_week { get; set; }

        public int question1 { get; set; }

        public int question2 { get; set; }

        public int question3 { get; set; }

    }
}