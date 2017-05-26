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
        //Structor
        public struct MyStruct
        {
            public string username;
            public string course_name;
            
        }

        //DatabaseConnection
        private IDatabaseConnection dbConn;

        public CoursesController(IDatabaseConnection conn)
        {
            this.dbConn = conn;
        }

        // GET & POST Functions
        [HttpGet]
        public IEnumerable<Course> Get()
        {
            return dbConn.Conn.Query<Course>(
                 "select * from courses");
        }

        [Route("[action]")]
        public IEnumerable<Course> MyCourses([FromBody]MyStruct args)
        {
            return this.GetMyCourses(args.username);
        }

        public IEnumerable<Course> GetMyCourses(string username)
        {
            return dbConn.Conn.Query<Course>(
                $"select distinct user_name, course_name, course_teacher, course_describe, task_describe, course_goal, result_coursestatus from courses, results, tasks, exams, users where users.user_id = results.result_userid and courses.course_id = results.result_courseid and tasks.task_id = results.result_taskid and exams.exam_id = results.result_examid and users.user_name = @username", new { username = username });
        }

        [Route("[action]")]
        public IEnumerable<Schedule> MySchedule([FromBody]MyStruct args)
        {
            return this.Schedule(args.course_name);
        }

        public IEnumerable<Schedule> Schedule(string course_name)
        {
            return dbConn.Conn.Query<Schedule>(
                $"select distinct schedules.* from schedules, courses, enrolled where enrolled.cid = courses.\"course_id\" and enrolled.cid = schedules.\"schedule_id\" and courses.\"course_name\" = '{course_name}'");
        }

        [Route("[action]")]
        public IEnumerable<Assignment> CourseAssignment([FromBody]MyStruct args)
        {
            return this.Assignment(args.course_name);
        }

        public IEnumerable<Assignment> Assignment(string course_name)
        {
            return dbConn.Conn.Query<Assignment>(
                $"select distinct course_name, exam_info, task_info, final_info from enrolled, users, courses, exams, tasks, finals where enrolled.uid = users.\"user_id\" and enrolled.cid = courses.\"course_id\" and courses.course_id = exams.\"exam_id\" and courses.course_id = finals.\"final_cid\" and courses.course_id = tasks.\"task_id\" and courses.course_name = '{course_name}'");
        }
    }
}
