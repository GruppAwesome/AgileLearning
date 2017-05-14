using System.Collections.Generic;
using WebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repositories;
using Dapper;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    public class CoursesController : Controller
    {

        private IDatabaseConnection dbConn;

        public CoursesController(IDatabaseConnection conn)
        {
            this.dbConn = conn;
        }

        // GET: api/values
        [HttpGet]
        public IEnumerable<Course> Get()
        {
            return dbConn.Conn.Query<Course>(
                 "select * from courses");
        }

        public struct MyCoursesArgs
        {
            public string course_status;
        }

        [HttpPost("mycourses")]
        public IEnumerable<Course> mycourses([FromBody]MyCoursesArgs args)
        {
            var user = dbConn.Conn.Query<Course>(
                $"select * from courses where \"course_status\" = '{args.course_status}'");
            return user;
        }
    }
}
