using WebAPI.Repositories;
using WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Dapper;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {

        //Structor
        public struct MyStruct
        {
            public string username;
            public string password;
        }

        //DatabaseConnection
        private IDatabaseConnection dbConn;

        public UsersController(IDatabaseConnection conn)
        {
            this.dbConn = conn;
        }

        //SHA1HASHING
        public static byte[] GetHash(string inputString)
        {
            HashAlgorithm algorithm = SHA1.Create();
            return algorithm.ComputeHash(Encoding.UTF8.GetBytes(inputString));
        }

        public static string GetHashString(string inputString)
        {
            StringBuilder sb = new StringBuilder();
            foreach (byte b in GetHash(inputString))
                sb.Append(b.ToString("X2"));

            return sb.ToString();
        }


        // GET & POST Functions
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return dbConn.Conn.Query<User>(
                 "select * from users");
        }

        [Route("[action]")]
        public User Login([FromBody]MyStruct args)
        {
            return this.LoginUser(args.username, GetHashString(args.password));
        }

        public User LoginUser(string username, string password)
        {
            return dbConn.Conn.QuerySingleOrDefault<User>(
                $"select * from users where \"password\" is not null and \"user_name\" = '{username}' and \"password\" = '{password}'");
        }

        [Route("[action]")]
        public IEnumerable<Grade> Grade([FromBody]MyStruct args)
        {
            return this.GetGrades(args.username);
        }

        public IEnumerable<Grade> GetGrades(string username)
        {

            return dbConn.Conn.Query<Grade>(
                $"select distinct user_name, course_name, task_info, result_task, exam_info, result_exam, final_info, result_final, result_coursegrade, result_coursestatus from courses, results, tasks, exams, finals, users where users.user_id = results.result_userid and courses.course_id = results.result_courseid and tasks.task_id = results.result_taskid and finals.final_id = results.result_finalid and exams.exam_id = results.result_examid and users.user_name = '{username}'");
        }

        [HttpPost("Todo")]
        public IEnumerable<Todo> Todo([FromBody]MyStruct args)
        {
            return this.GetTodo(args.username);
        }

        public IEnumerable<Todo> GetTodo(string username)
        {

            return dbConn.Conn.Query<Todo>(
                $"select distinct user_name, course_name, task_info, task_describe, task_time, final_info, final_describe, final_time, result_coursestatus from courses, results, tasks, exams, finals, users where users.user_id = results.result_userid and courses.course_id = results.result_courseid and tasks.task_id = results.result_taskid and finals.final_id = results.result_finalid and exams.exam_id = results.result_examid and users.user_name = @username and (results.result_coursestatus = 'Kommande' or results.result_coursestatus = 'Aktiv')", new { username = username });
        }

        [HttpPost("Feedback")]
        public IEnumerable<Feedback> Feedback([FromBody]MyStruct args)
        {
            var test123 = GetFeedback();
            
            if (test123 != null) {


                Console.Write(GetFeedback());
                return test123;

              }
            else{
                
                Console.Write("inne");
                dbConn.Conn.Query<Feedback> ($"INSERT into feedbacks (\"feedback_date\")VALUES ('0/3/3')");
                return test123;
            }


         /* Vi ska göra en fungerande query.
            Kolla om date är null.
            Om den är null insert (en till query)
            Annars ska den return feedback_vote från DB*/   
        }

        public IEnumerable<Feedback> GetFeedback()
        {
            return dbConn.Conn.Query<Feedback>($"select distinct feedback_date, feedback_vote from users, feedbacks WHERE feedbacks.feedback_uid = users.user_id AND users.user_name = 'Micke' and feedbacks.feedback_date = '5/3/2012'");
        }


    }
}
