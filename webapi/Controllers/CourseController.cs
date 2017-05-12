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
    }
}
