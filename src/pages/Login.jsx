import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import fondoLogin from '../assets/123.jpeg';
import logor from '../assets/mcvilllogo.png';
import '../App.css';

function Login() {

  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [slashpassword, setSlashPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(false);

  useEffect(() => {

  const correoGuardado =
    localStorage.getItem("correo");

  const passwordGuardada =
    localStorage.getItem("password");

  if (correoGuardado) {
    setCorreo(correoGuardado);
    setRecordarme(true);
  }

  if (passwordGuardada) {
    setPassword(passwordGuardada);
  }

}, []);

  const LoginUsuario = async () => {

    setMensaje("");

    if (correo.trim() === "") {
      setMensaje("Debe capturar el correo electrónico.");
      return;
    }

    if (password.trim() === "") {
      setMensaje("Debe capturar la contraseña.");
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo)) {
      setMensaje("El correo electrónico no es válido.");
      return;
    }

    try {

      const response = await fetch(
        "https://localhost:7231/api/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            correo: correo.trim(),
            password: password.trim()
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        if (recordarme) {
          localStorage.setItem("correo", correo);
        } else {
          localStorage.removeItem("correo");
        }
        navigate("/inicio", { replace: true });
        setCorreo("");
        setPassword("");
      }
      else {
        setMensaje(data.mensaje);
      }

    }
    catch {
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="bg-dark min-vh-100 text-light">
      <div className="position-relative vh-100 overflow-hidden">

        <img
          src={fondoLogin}
          alt="Fondo"
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            objectFit: 'contain'
          }}
        />

        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)'
          }}/>

        <div className="position-relative d-flex justify-content-center align-items-center h-100">

          <div
            className="card shadow p-4"
            style={{
              width: "400px",
              height: "505px",
              backgroundColor: 'rgba(8, 8, 8, 0.75)'
            }}>

            <div className="d-flex justify-content-between">
              <h2 className="m-0 text-titulo">
                Portal de Proveedores
              </h2>

              <img
                src={logor}
                alt="Logo"
                className="d-block"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "contain",
                  marginTop: "-38px"
                }}/>
            </div>

            <div
              className="input-group mb-3"
              style={{ marginTop: "10px" }}>
              <span className="input-group-text border-end-0 rounded-start-5">
                <i className="bi bi-envelope"></i>
              </span>

              <input
                type="text"
                className="form-control border-start-0 rounded-end-5"
                placeholder="Correo electrónico"
                maxLength="50"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value.replace(/\s/g, ""));
                  setMensaje("");
                }}/>
            </div>

            <div className="input-group mb-3">
              
              <span className="input-group-text border-end-0 rounded-start-5">
                <i className="bi bi-lock-fill"></i>
              </span>

              <input
                type={showPassword ? "text" : "password"}
                className="form-control border-start-0"
                placeholder="Contraseña"
                maxLength={50}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value.replace(/\s/g, ""));
                  setMensaje("");
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

            {mensaje && (
              <div className="alert alert-danger py-2">
                {mensaje}
              </div>
            )}

            <div className="row mb-4">
              <div className="col d-flex justify-content-start">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={recordarme}
                    onChange={(e) => setRecordarme(e.target.checked)}/>
                  <label
                    className="form-check-label text-small"
                    htmlFor="rememberMe" style={{ color: 'rgb(219, 217, 217)' }}>
                    Recordarme
                  </label>
                </div>
              </div>

              <div className="col text-center">
                <Link
                  to="/recuperarcontra"
                  className="link-primary text-small text-decoration-none">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div className="text-center">

              <button
                className="btn btn-primary rounded-5 mb-4"
                onClick={LoginUsuario}
                style={{ width: "200px" }}>
                Acceder
              </button>

              <div className="mb-3">
                <p>
                  <Link
                    to="/registro"
                    className="link-light text-small text-decoration-none">
                    Crear cuenta
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;