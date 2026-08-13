import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import logor from "../assets/mcvilllogo.png";

function GenerarNuevaContra() {

    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [esError, setEsError] = useState(false);
    const [slashpassword, setSlashPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const CambiarPassword = async () => {

        setMensaje("");

        if (password.trim() === "") {
            setEsError(true);
            setMensaje("Debe capturar la contraseña.");
            return;
        }

        try {

            const response = await fetch(
                "https://localhost:7231/api/RecuperarContra/Restablecer",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token,
                        password
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                setEsError(false);
                setMensaje("Contraseña actualizada correctamente.");

                setTimeout(() => {
                    navigate("/");
                }, 2000);

            } else {

                setEsError(true);
                setMensaje(data.mensaje);

            }

        }
        catch {

            setEsError(true);
            setMensaje("Error de conexión.");

        }
    };

    return (

        <div className="min-vh-100 d-flex text-light">

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
                        height: "450px",
                        backgroundColor: "rgba(17, 17, 17, 0.71)"
                    }}
                >

                    <img
                        src={logor}
                        alt="Logo"
                        className="d-block mx-auto"
                        style={{
                            width: "170px",
                            height: "170px",
                            objectFit: "contain",
                            marginTop: "-38px"
                        }}
                    />

                    <div
                        className="d-flex justify-content-center mb-3"
                        style={{ marginTop: "-30px" }}
                    >
                        <h2 className="m-0 text-tituloCC">
                            Restablecer contraseña
                        </h2>
                    </div>

                    <form>

                        <div className="mb-3">

                            <label
                                htmlFor="password"
                                className="form-label text-subtitulo"
                            >
                                Contraseña
                            </label>

                            <div className="input-group mb-3">

                                <span className="input-group-text bg-white border-end-0 rounded-start-5">
                                    <i className="bi bi-key-fill"></i>
                                </span>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="form-control bg-white border-start-0"
                                    maxLength={50}
                                    placeholder="******"
                                    autoComplete="new-password"
                                    value={password}
                                    onKeyDown={(e) => {
                                        if (e.key === " ") {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value.replace(/\s/g, "")
                                        )
                                    }
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
                            <div
                                className={`alert ${
                                    esError
                                        ? "alert-danger"
                                        : "alert-success"
                                }`}
                            >
                                {mensaje}
                            </div>
                        )}

                        <div
                            className="d-flex justify-content-center"
                            style={{ marginTop: "30px" }}
                        >

                            <button
                                type="button"
                                className="btn btn-primary rounded-5"
                                style={{ width: "240px" }}
                                onClick={CambiarPassword}
                            >
                                Confirmar
                            </button>

                        </div>

                        <div
                            className="mb-3 d-flex justify-content-center"
                            style={{ marginTop: "30px" }}
                        >
                            <p>
                                <Link
                                    to="/"
                                    className="link-danger text-decoration-none"
                                >
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

export default GenerarNuevaContra;