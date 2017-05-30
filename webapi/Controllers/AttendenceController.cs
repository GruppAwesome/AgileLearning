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

        }

        //DatabaseConnection
        private IDatabaseConnection dbConn;

        public AttendenceController(IDatabaseConnection conn)
        {
            this.dbConn = conn;
        }

        private String GetCurrentDate()
        {

            return DateTime.Now.ToString("yyyy-MM-dd");
        }


        [HttpPost("Presence")]
        public IEnumerable<Presence> Presence([FromBody]MyStruct args)
        {
            String currentDate = GetCurrentDate();

            IEnumerable<Presence> result = dbConn.Conn.Query<Presence>(

                @"select distinct user_id, coursecode_cid, course_name, coursecode_date
                from courses, coursecodes , users
                where coursecodes.coursecode_code = 'xxx'
                and courses.course_id = coursecodes.coursecode_cid
                and user_name = 'Ralle'
                AND coursecodes.coursecode_date = @theCurrentDate", new { theCurrentDate = "2016-06-06" });
            


            

            var course_cid = GetCoursecode_cid(result);
            var user_uid = GetCourse_uid(result);

        


            dbConn.Conn.Query<Presence>(@"INSERT INTO attendence (attendence_cid, attendence_uid, 
        attendence_date) SELECT @theCid , @theUid , @theCurrentDate 
        WHERE NOT EXISTS (SELECT attendence_uid 
        FROM attendence WHERE attendence_uid = @theUid 
        AND attendence_date = @theCurrentDate 
        AND attendence_cid = 2)", new { theCid = course_cid, theUid = user_uid, theCurrentDate = "2001-01-01" });

            return result;

        }



        private int GetCourse_uid(IEnumerable<Presence> result)
        {
            return result.ToList().First().user_id;
        }

        private int GetCoursecode_cid(IEnumerable<Presence> result)
        {
            return result.ToList().First().coursecode_cid;
        }
    }
}
