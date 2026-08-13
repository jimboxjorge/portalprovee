using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SendGrid;
using SendGrid.Helpers.Mail;
using portal_proveedor.Models;

namespace portal_proveedor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecuperarContra : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RecuperarContra(
            IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> RecuperarPassword(
            [FromBody] RecuperarPassword model)
        {
            string token = Guid.NewGuid().ToString();


            string conexion =
                _configuration.GetConnectionString("ConexionDB");

            using (SqlConnection cn =
                   new SqlConnection(conexion))
            {
                cn.Open();

                string sql = @"
                    UPDATE Portal_Proveed
                    SET TokenRecuperacion = @Token
                    WHERE Correo = @Correo";

                using (SqlCommand cmd =
                       new SqlCommand(sql, cn))
                {
                    cmd.Parameters.AddWithValue(
                        "@Token",
                        token);

                    cmd.Parameters.AddWithValue(
                        "@Correo",
                        model.Correo);

                    int filas = cmd.ExecuteNonQuery();

                    if (filas == 0)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            mensaje = "Correo no encontrado."
                        });
                    }
                }
            }

            string link =
                $"http://localhost:5173/generarNuevaContra/{token}";

            var apiKey =
                _configuration["SendGrid:ApiKey"];

            var client =
                new SendGridClient(apiKey);

            var from =
                new EmailAddress(
                    "sistemas@mcvill.com",
                    "Portal de Proveedores");

            var to =
                new EmailAddress(model.Correo);

            var subject =
                "Recuperación de contraseña";

            var htmlContent = $@"
                  <div style='font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;'>
                    <h1 style='color: #0d6efd; margin-bottom: 20px;'>Portal de Proveedores</h1>

                    <p style='font-size: 16px; margin-bottom: 10px;'>
                      Se solicitó un cambio de contraseña.
                    </p>

                    <p style='font-size: 14px; margin-bottom: 20px;'>
                      Da clic en el siguiente enlace:
                    </p>

                    <a href='{link}'
                       style='display: inline-block; background-color: #0d6efd; color: #fff; 
                              padding: 12px 24px; border-radius: 30px; text-decoration: none; 
                              font-size: 16px; font-weight: bold;'>
                      Restablecer contraseña
                    </a>

                    <p style='font-size: 12px; color: #777; margin-top: 30px;'>
                      Si no solicitaste esta cuenta, puedes ignorar este correo.
                    </p>
                  </div>";

            var msg =
                MailHelper.CreateSingleEmail(
                    from,
                    to,
                    subject,
                    "",
                    htmlContent);

            await client.SendEmailAsync(msg);

            return Ok(new
            {
                success = true,
                mensaje = "Se envió el correo de recuperación."
            });
        }

        [HttpPost("Restablecer")]
        public IActionResult Restablecer(
            [FromBody] RestablecerPassword model)
        {
            string conexion =
                _configuration.GetConnectionString("ConexionDB");

            using (SqlConnection cn =
                   new SqlConnection(conexion))
            {
                cn.Open();

                string sql = @"
                    UPDATE Portal_Proveed
                    SET Password = @Password,
                        TokenRecuperacion = ''
                    WHERE TokenRecuperacion = @Token";

                using (SqlCommand cmd =
                       new SqlCommand(sql, cn))
                {
                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
                    cmd.Parameters.AddWithValue("@Password", hashedPassword);

                    cmd.Parameters.AddWithValue(
                        "@Token",
                        model.Token);

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
                mensaje = "Contraseña actualizada correctamente."
            });
        }
    }
}