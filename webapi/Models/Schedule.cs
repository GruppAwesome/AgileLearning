using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models
{

    public class Schedule
    {
        public int schedule_id { get; set; }

        public String schedule_date { get; set; }

        public String schedule_time { get; set; }

        public String schedule_moment { get; set; }


    }
}