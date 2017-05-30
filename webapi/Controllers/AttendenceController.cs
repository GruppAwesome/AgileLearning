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

        private String GetCurrentDate()
        {

            return DateTime.Now.ToString("yyyy-MM-dd");
        }


        [HttpPost("Presence")]
        public Presence Presence([FromBody]MyStruct args)
        {
            String currentDate = GetCurrentDate();

            IEnumerable<Presence> result = dbConn.Conn.Query<Presence>(

                $"select distinct user_id, coursecode_cid, course_name, coursecode_date from courses, coursecodes , users where coursecodes.coursecode_code = '{args.coursecode_code}' and courses.course_id = coursecodes.coursecode_cid and user_name = 'Ralle' AND coursecodes.coursecode_date = '{GetCurrentDate()}'");

                var result112 = dbConn.Conn.Query<Presence>( $"select distinct user_id, coursecode_cid, course_name, coursecode_date from courses, coursecodes , users where coursecodes.coursecode_code = '{args.coursecode_code}' and courses.course_id = coursecodes.coursecode_cid and user_name = 'Ralle' AND coursecodes.coursecode_date = '{GetCurrentDate()}'", new { userid = 5 }).SingleOrDefault();

                if(result112 != null){
                    
                    IEnumerable<Presence> result1 = dbConn.Conn.Query<Presence>( $"select distinct user_id, coursecode_cid, course_name, coursecode_date from courses, coursecodes , users where coursecodes.coursecode_code = '{args.coursecode_code}' and courses.course_id = coursecodes.coursecode_cid and user_name = 'Ralle' AND coursecodes.coursecode_date = '{GetCurrentDate()}'", new { userid = 5 });

                     var hej12 = result112.coursecode_cid;
                     var apa = result1.ToList().First().coursecode_cid;
                     var dance = result.First().course_name;

                        Console.Write(dance);
                    Console.Write("inte null");
                    dbConn.Conn.Query<Presence>($"INSERT INTO attendence (attendence_cid, attendence_uid, attendence_date) SELECT @theCid , @theUid , '{GetCurrentDate()}' WHERE NOT EXISTS (SELECT attendence_uid FROM attendence WHERE attendence_uid = @theUid AND attendence_date = '{GetCurrentDate()}' AND attendence_cid = 2)", new { theCid = 2, theUid = 2 });
                    
                }



             Console.Write(result112);

             

           
        

               

            






            return result112;

        }



        public int GetCourse_uid(IEnumerable<Presence> result)
        {
            return result.ToList().First().user_id;
        }

        public int GetCoursecode_cid(IEnumerable<Presence> result)
        {
            return result.ToList().First().coursecode_cid;
        }
    }
}