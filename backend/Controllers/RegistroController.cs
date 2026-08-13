using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using portal_proveedor.Models;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Diagnostics.Contracts;
using BCrypt.Net;

namespace portal_proveedor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistroController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RegistroController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Registrar(
            [FromBody] RegistroProveedor proveedor)
        {
            string conexion =
                _configuration.GetConnectionString("ConexionDB");

            string token = Guid.NewGuid().ToString();
            string hash = BCrypt.Net.BCrypt.HashPassword(proveedor.Password);

            using (SqlConnection cn =
                   new SqlConnection(conexion))
            {
                cn.Open();

                string sqlExiste = @"
                    SELECT COUNT(*)
                    FROM Portal_Proveed
                    WHERE Correo = @Correo";

                using (SqlCommand cmdExiste =
                       new SqlCommand(sqlExiste, cn))
                {
                    cmdExiste.Parameters.AddWithValue(
                        "@Correo",
                        proveedor.Correo);

                    int existe =
                        Convert.ToInt32(
                            cmdExiste.ExecuteScalar());

                    if (existe > 0)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            mensaje = "El correo ya existe."
                        });
                    }
                }

                string sqlInsert = @"
                    INSERT INTO Portal_Proveed
                    (
                        Nombre,
                        Correo,
                        Password,
                        Confirmado,
                        Token
                    )
                    VALUES
                    (
                        @Nombre,
                        @Correo,
                        @Password,
                        0,
                        @Token
                    )";

                using (SqlCommand cmd =
                       new SqlCommand(sqlInsert, cn))
                {
                    cmd.Parameters.AddWithValue(
                        "@Nombre",
                        proveedor.Nombre);

                    cmd.Parameters.AddWithValue(
                        "@Correo",
                        proveedor.Correo);

                    cmd.Parameters.AddWithValue(
                        "@Password",
                        hash);

                    cmd.Parameters.AddWithValue(
                        "@Token",
                        token);

                    cmd.ExecuteNonQuery();
                }
            }

            try
            {
                string apiKey =
                    _configuration["SendGrid:ApiKey"];

                var client =
                    new SendGridClient(apiKey);

                var from =
                    new EmailAddress(
                        "sistemas@mcvill.com",
                        "Portal de Proveedores");

                var to =
                    new EmailAddress(
                        proveedor.Correo);

                string urlConfirmacion =
                    $"https://localhost:7231/api/Registro/confirmar/{token}";

                string asunto =
                    "Confirmación de cuenta";

                string html = $@"
                  <div style='font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;'>
                    <h1 style='color: #0d6efd; margin-bottom: 20px;'>Portal de Proveedores</h1>

                    <p style='font-size: 16px; margin-bottom: 10px;'>
                      ¡Ya casi! Confirma tu correo para terminar de registrarte.
                    </p>

                    <p style='font-size: 14px; margin-bottom: 20px;'>
                      Haz clic en el botón de abajo para activar tu cuenta:
                    </p>

                    <a href='{urlConfirmacion}' 
                       style='display: inline-block; background-color: #0d6efd; color: #fff; 
                              padding: 12px 24px; border-radius: 30px; text-decoration: none; 
                              font-size: 16px; font-weight: bold;'>
                      Confirmar cuenta
                    </a>

                    <p style='font-size: 12px; color: #777; margin-top: 30px;'>
                      Si no solicitaste esta cuenta, puedes ignorar este correo.
                    </p>
                  </div>
                ";


                var msg =
                    MailHelper.CreateSingleEmail(
                        from,
                        to,
                        asunto,
                        "",
                        html);

                await client.SendEmailAsync(msg);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    mensaje = "Error enviando correo: " + ex.Message
                });
            }

            return Ok(new
            {
                success = true,
                mensaje = "Cuenta creada. Revisa tu correo para confirmar tu cuenta."
            });
        }

        [HttpGet("confirmar/{token}")]
        public IActionResult Confirmar(string token)
        {
            string conexion =
                _configuration.GetConnectionString("ConexionDB");

            using (SqlConnection cn =
                   new SqlConnection(conexion))
            {
                cn.Open();

                string sql = @"
                    UPDATE Portal_Proveed
                    SET Confirmado = 1
                    WHERE Token = @Token";

                using (SqlCommand cmd =
                       new SqlCommand(sql, cn))
                {
                    cmd.Parameters.AddWithValue(
                        "@Token",
                        token);

                    int filas =
                        cmd.ExecuteNonQuery();

                    if (filas == 0)
                    {
                        return BadRequest(
                            "Token inválido.");
                    }
                }
            }

            return Ok(
                "Cuenta confirmada correctamente, regrese a la pagina principal.");
        }
    }
}