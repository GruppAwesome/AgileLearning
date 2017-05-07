
using System.Collections.Generic;
using Npgsql;

namespace WebAPI.Repositories
{


    public interface IDatabaseConnection
    {
        NpgsqlConnection Conn { get; }
    }

    public class DatabaseConnection : IDatabaseConnection
    {
        private static string connectionString = "Host=weboholics-debian.dyndns-ip.com;Username=grupp2;Password=xxx;Database=gruppawesome";


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
