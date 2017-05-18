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
            public string username;
        }

        [HttpPost("mycourses")]
        public IEnumerable<Course> mycourses([FromBody]MyCoursesArgs args)
        {
            var courses = this.MyCourses(args.username);
            return courses;
        }

        public IEnumerable<Course> MyCourses(string username)
        {
            var firstname = dbConn.Conn.Query<Course>("select first_name from users where \"user_name\" = '{username}'");

            return dbConn.Conn.Query<Course>(
                "select * from users, courses, enrolled where enrolled.uid = users.\"user_id\" and enrolled.cid = courses.\"course_id\" and users.\"first_name\" = '{firstname}'");
        }
    }
}
