using System;
using Newtonsoft;
using Newtonsoft.Json;

namespace WebAPI.Models {

    public class AttendanceCode
    {

        public int coursecode_cid { get; set; }

        public String coursecode_date { get; set; }

        public String coursecode_code { get; set; }
        
    }
}