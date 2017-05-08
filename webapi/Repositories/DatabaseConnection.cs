
using System.Collections.Generic;
using Npgsql;
using System.IO;
using System;
using Newtonsoft;
using Newtonsoft.Json;
using WebAPI.Models;

namespace WebAPI.Repositories
{

    public interface IDatabaseConnection
    {
        NpgsqlConnection Conn { get; }
    }

    public class DatabaseConnection : IDatabaseConnection
    {        
        private static string connectionString = JsonConvert.DeserializeObject<Secret>(File.ReadAllText("secrets.json")).DatabaseKey;
        

        // The actual Pool
        private static IList<NpgsqlConnection> connectionPool = SetupPool();

        static IList<NpgsqlConnection> SetupPool()
        {
            // Setup a connection Pool here, instead of using a new connection each time.
            // Setup the pool.. 
            return new List<NpgsqlConnection>();
        }

        public NpgsqlConnection Conn
        {
            get {
                // Should pick a connection from Pool.
                var newConn = new NpgsqlConnection(connectionString);
                newConn.Open();
                return newConn;
            }
        }
    }
}
