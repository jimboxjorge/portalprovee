using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using portal_proveedor.Models;

namespace portal_proveedor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult Login([FromBody] PortalProveedoresAPI login)
        {
            try
            {
                string? conexion =
                    _configuration.GetConnectionString("ConexionDB");

                // Verificar que Azure esté recibiendo ConexionDB
                if (string.IsNullOrWhiteSpace(conexion))
                {
                    return StatusCode(500, new
                    {
                        success = false,
                        mensaje = "No se encontró la cadena de conexión ConexionDB."
                    });
                }

                using (SqlConnection cn = new SqlConnection(conexion))
                {
                    cn.Open();

                    string sql = @"
                        SELECT Password, Confirmado
                        FROM Portal_Proveed
                        WHERE Correo = @Correo";

                    using (SqlCommand cmd = new SqlCommand(sql, cn))
                    {
                        cmd.Parameters.AddWithValue(
                            "@Correo",
                            login.Correo);

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            if (!dr.Read())
                            {
                                return Unauthorized(new
                                {
                                    success = false,
                                    mensaje = "Correo incorrecto."
                                });
                            }

                            string hashGuardado =
                                dr["Password"]?.ToString() ?? "";

                            bool confirmado =
                                Convert.ToBoolean(dr["Confirmado"]);

                            bool passwordCorrecto =
                                BCrypt.Net.BCrypt.Verify(
                                    login.Password,
                                    hashGuardado);

                            if (!passwordCorrecto)
                            {
                                return Unauthorized(new
                                {
                                    success = false,
                                    mensaje = "Contraseña incorrecta."
                                });
                            }

                            if (!confirmado)
                            {
                                return Unauthorized(new
                                {
                                    success = false,
                                    mensaje = "Debes confirmar tu correo electrónico antes de iniciar sesión."
                                });
                            }

                            return Ok(new
                            {
                                success = true,
                                mensaje = "Acceso correcto"
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    mensaje = ex.Message
                });
            }
        }
    }
}