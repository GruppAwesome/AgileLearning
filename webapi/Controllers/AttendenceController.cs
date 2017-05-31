using System.Collections.Generic;
using WebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repositories;
using Dapper;
using System;
using System.Linq;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    public class AttendenceController : Controller
    {
        //Structor
        public struct MyStruct
        {
            public string username;
            public string course_name;

            public string coursecode_code;

        }

        //DatabaseConnection
        private IDatabaseConnection dbConn;

        public AttendenceController(IDatabaseConnection conn)
        {
            this.dbConn = conn;
        }

        [HttpPost("Presence")]
        public IEnumerable<Presence> Presence([FromBody]MyStruct args)
        {

            IEnumerable<Presence> result = dbConn.Conn.Query<Presence>($"select distinct user_id, coursecode_cid, course_name, coursecode_date from courses, coursecodes , users where coursecodes.coursecode_code = '{args.coursecode_code}' and courses.course_id = coursecodes.coursecode_cid and user_name = @theName AND coursecodes.coursecode_date = '{GetCurrentDate()}'", new {theName = args.username});

            if (result.FirstOrDefault() != null)
            {
                var coursecode_cid = result.ToList().First().coursecode_cid;
                var user_id = result.ToList().First().user_id;

                dbConn.Conn.Query<Presence>($"INSERT INTO attendence (attendence_cid, attendence_uid, attendence_date)SELECT @theCid , @theUid, '{GetCurrentDate()}' WHERE NOT EXISTS (SELECT attendence_uid, attendence_cid, attendence_date FROM attendence WHERE attendence_cid = @theCid AND attendence_uid = @theUid AND attendence_date = '{GetCurrentDate()}')", new { theCid = coursecode_cid, theUid = user_id });
            //Dollabillia göra så att du kan skicka in den ifrån C sharp
            }

            return result.ToList();
        }

        private String GetCurrentDate()
        {
            return DateTime.Now.ToString("yyyy-MM-dd");
        }
    }
}
