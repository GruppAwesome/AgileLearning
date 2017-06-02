using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class SumOfWeeklyFeedback
    {
        public int weekly_week { get; set; }

        public int sum { get; set; }

    }
}