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
            public int feedback_vote;
            public int user_id;
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

        public String GetDate(){
             DateTime thisDay = DateTime.Today;
             Console.WriteLine(thisDay.ToString("d"));
            String today = thisDay.ToString("d");
            return today;
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
        public Feedback Feedback ([FromBody]MyStruct args)
        {       
                var myDate = DateTime.Now.ToString("yyyy-MM-dd");
                Console.Write(myDate);

                var result = dbConn.Conn.Query<Feedback>($"select distinct feedback_date, feedback_vote from users, feedbacks WHERE feedbacks.feedback_uid = users.user_id AND users.user_id = '2' and feedbacks.feedback_date = '{myDate}'").SingleOrDefault();
                
                if(result != null){
                    Console.Write("inte null");
                    return result;
                }
                else{
                    Console.Write("null");
                    return result;
                }
           
        }

               [HttpPost("SendFeedback")]
        public Feedback SendFeedback ([FromBody]MyStruct args)
        {      
                var myDate = DateTime.Now.ToString("yyyy-MM-dd");
               
                
                Console.Write(args.feedback_vote);

                var sendResult = dbConn.Conn.Query<Feedback>($"INSERT INTO feedbacks(feedback_uid, feedback_vote, feedback_date)SELECT 2, '{args.feedback_vote}' , '{myDate}' WHERE NOT EXISTS (SELECT feedback_uid FROM feedbacks WHERE feedback_uid = '2' AND feedback_date = '{myDate}')");
                
               return dbConn.Conn.Query<Feedback>($"select distinct feedback_date, feedback_vote from users, feedbacks WHERE feedbacks.feedback_uid = users.user_id AND users.user_id = '2' and feedbacks.feedback_date = '{myDate}'").SingleOrDefault();
           
        }


  


    }
}
