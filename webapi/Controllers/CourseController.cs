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

        [Route("[action]")]
        public IEnumerable<Course> MyCourses([FromBody]MyCoursesArgs args)
        {
            var courses = this.UserCourses(args.username);
            return courses;
        }

        public IEnumerable<Course> UserCourses(string username)
        {
            return dbConn.Conn.Query<Course>(
                $"select courses.*, exams.*, tasks.* from users, courses, enrolled left outer join exams on enrolled.eid = exams.\"exam_id\" left outer join tasks on enrolled.tid = tasks.\"task_id\" where enrolled.uid = users.\"user_id\" and enrolled.cid = courses.\"course_id\" and users.\"user_name\" = '{username}'");
        }
        public struct MyScheduleArgs
        {
            public string course_name;
        }

        [Route("[action]")]
        public IEnumerable<Schedule> MySchedule([FromBody]MyScheduleArgs args)
        {
            var courses = this.Schedule(args.course_name);
            return courses;
        }

        public IEnumerable<Schedule> Schedule(string course_name)
        {
            return dbConn.Conn.Query<Schedule>(
                $"select distinct schedules.* from schedules, courses, enrolled where enrolled.cid = courses.\"course_id\" and enrolled.cid = schedules.\"schedule_id\" and courses.\"course_name\" = '{course_name}'");
        }

        public struct AssignmentArgs
        {
            public string course_name;
        }

        [Route("[action]")]
        public IEnumerable<Assignment> CourseAssignment([FromBody]AssignmentArgs args)
        {
            var courses = this.Assignment(args.course_name);
            return courses;
        }

        public IEnumerable<Assignment> Assignment(string course_name)
        {
            return dbConn.Conn.Query<Assignment>(
                $"select distinct course_name, exam_info, task_info, final_info from enrolled, users, courses, exams, tasks, finals where enrolled.uid = users.\"user_id\" and enrolled.cid = courses.\"course_id\" and courses.course_id = exams.\"exam_id\" and courses.course_id = finals.\"final_cid\" and courses.course_id = tasks.\"task_id\" and courses.course_name = '{course_name}'");
        }
    }
}
