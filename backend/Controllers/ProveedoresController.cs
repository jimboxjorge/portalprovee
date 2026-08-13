using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using portal_proveedor.Models;

namespace portal_proveedor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProveedoresController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ProveedoresController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult ObtenerProveedores()
        {
            string conexion =
                _configuration.GetConnectionString("ConexionDB");

            List<Proveedor> proveedores =
                new List<Proveedor>();

            using (SqlConnection cn =
                   new SqlConnection(conexion))
            {
                cn.Open();

                string sql = @"
                    SELECT
                        Id,
                        Nombre,
                        RFC,
                        Correo
                    FROM Proveedores_del_portal
                    ORDER BY Nombre";

                using (SqlCommand cmd =
                       new SqlCommand(sql, cn))
                {
                    using (SqlDataReader reader =
                           cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            proveedores.Add(
                                new Proveedor
                                {
                                    IdProveedor =
                                        Convert.ToInt32(
                                            reader["Id"]),

                                    Nombre =
                                        reader["Nombre"].ToString(),

                                    RFC =
                                        reader["RFC"].ToString(),

                                    Correo =
                                        reader["Correo"].ToString()
                                }
                            );
                        }
                    }
                }
            }

            return Ok(proveedores);
        }

        [HttpPost]
        public IActionResult GuardarProveedor(
            [FromBody] Proveedor proveedor)
        {
            string conexion =
                _configuration.GetConnectionString("ConexionDB");

            using (SqlConnection cn =
                   new SqlConnection(conexion))
            {
                cn.Open();


                string sqlExiste = @"
                    SELECT COUNT(*)
                    FROM Proveedores_del_portal
                    WHERE RFC = @RFC";

                using (SqlCommand cmdExiste =
                       new SqlCommand(sqlExiste, cn))
                {
                    cmdExiste.Parameters.AddWithValue(
                        "@RFC",
                        proveedor.RFC);

                    int existe =
                        Convert.ToInt32(
                            cmdExiste.ExecuteScalar());

                    if (existe > 0)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            mensaje = "El RFC ya existe."
                        });
                    }
                }

                string sqlInsert = @"
                    INSERT INTO Proveedores_del_portal
                    (
                        Nombre,
                        RFC,
                        Correo
                    )
                    VALUES
                    (
                        @Nombre,
                        @RFC,
                        @Correo
                    )";

                using (SqlCommand cmd =
                       new SqlCommand(sqlInsert, cn))
                {
                    cmd.Parameters.AddWithValue(
                        "@Nombre",
                        proveedor.Nombre);

                    cmd.Parameters.AddWithValue(
                        "@RFC",
                        proveedor.RFC);

                    cmd.Parameters.AddWithValue(
                        "@Correo",
                        proveedor.Correo);

                    cmd.ExecuteNonQuery();
                }
            }

            return Ok(new
            {
                success = true,
                mensaje = "Proveedor guardado correctamente."
            });
        }
    }
}