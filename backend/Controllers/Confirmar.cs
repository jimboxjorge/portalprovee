using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace portal_proveedor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfirmarController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ConfirmarController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("{token}")]
        public IActionResult ConfirmarCuenta(string token)
        {
            string conexion =
                _configuration.GetConnectionString("ConexionDB");

            using (SqlConnection cn =
                   new SqlConnection(conexion))
            {
                cn.Open();

                string sql = @"
                    UPDATE Portal_Proveed
                    SET Confirmado = 1,
                        Token = NULL
                    WHERE Token = @Token";

                using (SqlCommand cmd =
                       new SqlCommand(sql, cn))
                {
                    cmd.Parameters.AddWithValue(
                        "@Token",
                        token);

                    int filas = cmd.ExecuteNonQuery();

                    if (filas == 0)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            mensaje = "Token inválido o expirado."
                        });
                    }
                }
            }

            return Ok(new
            {
                success = true,
                mensaje = "Cuenta confirmada correctamente."
            });
        }
    }
}