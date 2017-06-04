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
using System.Globalization;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        //Structor
        public struct MyStruct
        {
            public String username;
            public String password;
            public String weekly_free_text1;
            public String weekly_free_text2;
            public String coursecode_date;
            public String coursecode_code;
            public int feedback_vote;
            public int user_id;
            public int weekly_q1;
            public int weekly_q2;
            public int weekly_q3;
            public int weekly_uid;
            public int coursecode_cid;


        }

        //DatabaseConnection
        private IDatabaseConnection dbConn;

        public UsersController(IDatabaseConnection conn)
        {
            this.dbConn = conn;
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
            return dbConn.Conn.QuerySingleOrDefault<User>(
                @"select * from users where password is not null 
                and user_name = @theUsername 
                and password = @thePassword", new { theUsername = args.username, thePassword = GetHashString(args.password) });
        }

        [Route("[action]")]
        public IEnumerable<Grade> Grade([FromBody]MyStruct args)
        {
            return dbConn.Conn.Query<Grade>(
                @"select distinct user_name, course_name, task_info, result_task, exam_info, result_exam, final_info, result_final, result_coursegrade, result_coursestatus 
                from courses, results, tasks, exams, finals, users 
                where users.user_id = results.result_userid 
                and courses.course_id = results.result_courseid 
                and tasks.task_id = results.result_taskid and finals.final_id = results.result_finalid 
                and exams.exam_id = results.result_examid
                and (results.result_coursestatus = 'Avslutade' 
                OR results.result_coursestatus = 'Aktiv')   
                and users.user_name = @theUsername", new { theUsername = args.username });
        }

        [HttpPost("Todo")]
        public IEnumerable<Todo> Todo([FromBody]MyStruct args)
        {
            return dbConn.Conn.Query<Todo>(
                @"select distinct user_name, course_name, task_info, task_describe, task_time, final_info, final_describe, final_time, result_coursestatus 
                from courses, results, tasks, exams, finals, users 
                where users.user_id = results.result_userid 
                and courses.course_id = results.result_courseid 
                and tasks.task_id = results.result_taskid and finals.final_id = results.result_finalid 
                and exams.exam_id = results.result_examid and users.user_name = @theUsername 
                and results.result_coursestatus = 'Aktiv'", new { theUsername = args.username });
        }

        [HttpPost("HasVoted")]
        public Feedback HasVoted([FromBody]MyStruct args)
        {

            return dbConn.Conn.Query<Feedback>(
                $@"select distinct feedback_date, feedback_vote from users, feedbacks WHERE feedbacks.feedback_uid = users.user_id 
                AND users.user_id = @userid and feedbacks.feedback_date = '{GetCurrentDate()}'", new { userid = args.user_id }).SingleOrDefault();

        }

        [HttpPost("SendFeedback")]
        public Feedback SendFeedback([FromBody]MyStruct args)
        {

            dbConn.Conn.Query<Feedback>(
                $@"INSERT INTO feedbacks(feedback_uid, feedback_vote, feedback_date)SELECT @userid , '{args.feedback_vote}' , 
                '{GetCurrentDate()}' WHERE NOT EXISTS (SELECT feedback_uid FROM feedbacks WHERE feedback_uid = @userid AND feedback_date = '{GetCurrentDate()}')",
                new { userid = args.user_id });

            return dbConn.Conn.Query<Feedback>(
                $@"select distinct feedback_date, feedback_vote from users, feedbacks 
                WHERE feedbacks.feedback_uid = users.user_id AND users.user_id = @userid and 
                feedbacks.feedback_date = '{GetCurrentDate()}'", new { userid = args.user_id }).SingleOrDefault();

        }

        [HttpGet("ResetFeedback")]
        public void ResetFeedback()
        {
            dbConn.Conn.Query<Feedback>($"DELETE FROM feedbacks WHERE feedback_uid=3 OR feedback_uid = 2");
        }

        [HttpGet("ResetWeekFeedback")]
        public void ResetWeekFeedback()
        {
            dbConn.Conn.Query($"DELETE FROM weeklyfeedbacks WHERE weekly_uid= 3 OR weekly_uid = 2");
        }

        [HttpPost("ShowWeekFeedback")]
        public IEnumerable<Weeklyfeedback> HasVotedWeekly([FromBody]MyStruct args)
        {

            IEnumerable<Weeklyfeedback> result = dbConn.Conn.Query<Weeklyfeedback>(
                $@"select distinct weekly_q1, weekly_q2, weekly_q3, class_name
                from weeklyfeedbacks, classes, users , enrolledclasses
                where enrolledclasses.enrolledclass_uid = users.user_id
                and enrolledclasses.enrolledclass_clid = classes.class_id
                and weeklyfeedbacks.weekly_week = {GetWeekNumber(DateTime.Now)}");

            DayOfWeek day = DateTime.Now.DayOfWeek;

            if (result.FirstOrDefault() == null && (day >= DayOfWeek.Sunday) && (day <= DayOfWeek.Monday))
            {
                return null;
            }
            else
            {
                return result;
            }

        }

        [HttpPost("Sendweeklyfeedback")]
        public bool Sendweeklyfeedback([FromBody]MyStruct args)
        {
            DayOfWeek day = DateTime.Now.DayOfWeek;

            if(day >= DayOfWeek.Sunday && day <= DayOfWeek.Monday)// The week begins with sunday in most countries ;)

            {

                dbConn.Conn.Query<Weeklyfeedback>($@"INSERT INTO weeklyfeedbacks(weekly_q1 , weekly_q2, weekly_q3 ,weekly_free_text1, weekly_free_text2, weekly_uid, weekly_week ) 
            SELECT @theQ1,@theQ2,@theQ3,@theFreeText1, @theFreeText2, @theUid , {GetWeekNumber(DateTime.Now)} 
            WHERE NOT EXISTS (SELECT weekly_week FROM weeklyfeedbacks WHERE weekly_week = {GetWeekNumber(DateTime.Now)} AND weekly_uid = @theUid)",
                new { theQ1 = args.weekly_q1, theQ2 = args.weekly_q2, theQ3 = args.weekly_q3, theFreeText1 = args.weekly_free_text1, theFreeText2 = args.weekly_free_text2, theUid = args.weekly_uid });

                return true;
            }

            return false;
        }


        [HttpPost("AddAttendanceCode")]
        public void AddAttendanceCode([FromBody]MyStruct args)
        {

            dbConn.Conn.Query<AttendanceCode>($@"INSERT INTO coursecodes(coursecode_cid , coursecode_date, coursecode_code) 
            SELECT 2 , '{GetCurrentDate()}' , @theCode 
            WHERE NOT EXISTS (SELECT coursecode_date FROM coursecodes WHERE coursecode_date = '{GetCurrentDate()}' AND coursecode_cid = 2)",
            new { theCid = args.coursecode_cid, theCode = args.coursecode_code });

        }

        [HttpGet("DailyFeedbackAverage")]
        public IEnumerable<FeedbackAverage> DailyFeedbackAverage()
        {
            return dbConn.Conn.Query<FeedbackAverage>
            ($"SELECT feedback_date , Avg(feedback_vote) AS Average from feedbacks GROUP BY feedback_date , feedback_date");
        }

        [HttpGet("WeeklyFeedbackSum")]
        public IEnumerable<WeeklyFeedbackSum> WeeklyFeedbackSum()
        {
            return dbConn.Conn.Query<WeeklyFeedbackSum>(
                $@"SELECT weekly_week , Sum(weekly_q1) AS Question1 , Sum(weekly_q2) AS Question2 , Sum(weekly_q3) AS Question3 
                from weeklyfeedbacks Group by weekly_week");
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

        //CurrentDate
        private String GetCurrentDate()
        {

            return DateTime.Now.ToString("yyyy-MM-dd");
        }
        public static int GetWeekNumber(DateTime dtPassed)
        {
            CultureInfo ciCurr = CultureInfo.CurrentCulture;
            int weekNum = ciCurr.Calendar.GetWeekOfYear(dtPassed, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
            return weekNum;
        }





    }
}
