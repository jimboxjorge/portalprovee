import { useState } from "react";
import '../CrearCuenta.css';
import logor from '../assets/mcvilllogo.png';
import { Link, useNavigate } from 'react-router-dom';

function CrearCuenta() {

  const navigate = useNavigate();
  const [nombre, setNomProve] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("danger");
  const [slashpassword, setSlashPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const Registrar = async () => {

  setMensaje("");

  if (nombre.trim() === "") {
    setTipoMensaje("danger");
    setMensaje("Debe capturar el nombre proveedor.");
    return;
  }

  if (correo.trim() === "") {
    setTipoMensaje("danger");
    setMensaje("Debe capturar el correo.");
    return;
  }

  if (password.trim() === "") {
    setTipoMensaje("danger");
    setMensaje("Debe capturar la contraseña.");
    return;
  }
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo)) {
      setTipoMensaje("danger");
      setMensaje("El correo electrónico no es válido.");
      return;
    }

  try {

    const response = await fetch(
      "https://portal-proveedores-api-fje7dya0h2c7b5bw.mexicocentral-01.azurewebsites.net/api/Registro",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          correo,
          password
        })
      }
    );

    const data = await response.json();

    if (data.success) {

      setTipoMensaje("success");
      setMensaje("Cuenta creada correctamente.");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);

    }
    else {
      setTipoMensaje("danger");
      setMensaje(data.mensaje);
    }

  }
  catch {
    setTipoMensaje("danger");
    setMensaje("Error de conexión.");
  }
};

  return (
  <div className="bg-fondocc min-vh-100 d-flex text-light">
    <div
    className="position-absolute top-0 start-0 w-100 h-100"
    style={{
      backgroundColor: "rgba(0,0,0,0.5)"
    }}
  />

    <div className="container mt-5 d-flex justify-content-center align-items-center">
      <div
        className="card shadow p-4"
        style={{
          width: "450px",
          height: "630px",
          backgroundColor: "rgba(17, 17, 17, 0.71)",
        }}
      >
        <img
          src={logor}
          alt="Logo"
          className="d-block mx-auto"
          style={{
            width: "170px",
            height: "170px",
            objectFit: "contain"
          }}
        />

        <div className="d-flex justify-content-center  mb-3" style={{ marginTop: "15px" }}>
          <h2 className="m-0 text-tituloCC">Crear cuenta</h2>
        </div>

        <form>

          <div className="mb-3">
            <label htmlFor="proveedor" className="form-label text-subtitulo">
              Nombre Proveedor
            </label>

            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 rounded-start-5">
                <i className="bi bi-person-fill"></i>
              </span>

              <input
                type="text"
                id="proveedor"
                className="form-control bg-white border-start-0 rounded-end-5"
                value={nombre}
                maxLength={80}
                placeholder="Proveedor"
                autoComplete="off"
                onChange={(e) => {setNomProve(e.target.value);
                  setMensaje("");
                  setTipoMensaje("");
                }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-subtitulo">
              Correo electrónico
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 rounded-start-5">
                <i class="bi bi-envelope"></i>
              </span>

              <input
                type="email"
                className="form-control bg-white border-start-0 rounded-end-5"
                value={correo}
                placeholder="usuario@ejemplo.com"
                maxlength="50"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setCorreo(e.target.value.replace(/\s/g, ""));
                  setMensaje("");
                  setTipoMensaje("");
                }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-subtitulo">
              Contraseña
            </label>

            <div className="input-group mb-3">
              <span className="input-group-text bg-white border-end-0 rounded-start-5">
                <i className="bi bi-lock-fill"></i>
              </span>

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control border-start-0"
                value={password}
                maxLength={50}
                placeholder="******"
                autoComplete="new-password"
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setPassword(e.target.value.replace(/\s/g, ""));
                  setMensaje("");
                  setTipoMensaje("");
                }}
              />

              <span
                className="input-group-text rounded-end-5"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
              </span>
            </div>
          </div>

          {mensaje && (
            <div className={`alert alert-${tipoMensaje} mt-2`}>
              {mensaje}
            </div>
          )}

          <div className="d-flex justify-content-center" style={{ marginTop: "30px" }}>
              <button
                type="button"
                className="btn btn-primary rounded-5"
                onClick={Registrar}
                style={{ width: "200px" }}
              >
                Registrarse
              </button>
          </div>
          
          <div className="mb-3 d-flex justify-content-center" style={{ marginTop: "30px" }}>
            <p>
              <Link to="/" className="link-danger text-decoration-none">
                Atrás
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  </div>
);
}

export default CrearCuenta;
