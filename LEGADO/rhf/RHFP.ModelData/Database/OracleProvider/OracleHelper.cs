using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.ModelData.Database.Entity.OracleProvider
{
    public class OracleHelper
    {
        private readonly string _connectionString;

        public OracleHelper()
        {
            _connectionString = ConfigurationManager.ConnectionStrings["OracleDb"].ConnectionString;
        }

        public DataTable ExecuteQuery(string sql)
        {
            using (var connection = new OracleConnection(_connectionString))
            using (var command = new OracleCommand(sql, connection))
            {
                var dataTable = new DataTable();
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    dataTable.Load(reader);
                }

                return dataTable;
            }
        }
    }
}
