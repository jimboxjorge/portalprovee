import { useState } from "react";
import logor from '../assets/mcvilllogo.png';
import { Link } from 'react-router-dom';

function RecuperarContra(){

    const [correo, setCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("danger");

    const RecuperarPassword = async () => {

        setMensaje("");

        if (correo.trim() === "") {
            setTipoMensaje("danger");
            setMensaje("Debe capturar el correo.");
            return;
        }
        try {

            const response = await fetch(
                "https://localhost:7231/api/RecuperarContra",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        correo
                    })
                }
            );

            const data = await response.json();
            setTipoMensaje("success");
            setMensaje(data.mensaje);

        }
        catch {
            setTipoMensaje("danger");
            setMensaje("Error de conexión.");
        }
    };
    return(

        <div className="bg-fondocc min-vh-100 d-flex text-light">
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                backgroundColor: "rgba(2, 1, 1, 0.34)"
                }}
            />

            <div className="container mt-5 d-flex justify-content-center align-items-center">
                <div
                    className="card shadow p-4"
                    style={{
                    width: "450px",
                    height: "430px",
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
                            
                    <div className="d-flex justify-content-center  mb-3" style={{ marginTop: "10px" }}>
                        <h2 className="m-0 text-tituloCC">Recuperar Contraseña</h2>
                    </div>

                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label text-subtitulo">
                            Correo electrónico
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 rounded-start-5">
                                    <i className="bi bi-envelope"></i>
                                </span>

                                <input
                                    type="email"
                                    className="form-control bg-white border-start-0 rounded-end-5"
                                    placeholder="usuario@ejemplo.com"
                                    value={correo}
                                    maxLength="50"
                                    autoComplete="off"
                                    onKeyDown={(e) => {
                                        if (e.key === " ") {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        setCorreo(e.target.value.replace(/\s/g, ""));
                                        setTipoMensaje("");
                                        setMensaje("");
                                    }}
                                />
                            </div>

                            
                        {mensaje && (
                            <div className="alert alert-info mt-3">
                                {mensaje}
                            </div>
                        )}
                        </div>

                        <div className="d-flex justify-content-center" style={{ marginTop: "30px" }}>
                            <button
                                type="button"
                                className="btn btn-primary rounded-5"
                                onClick={RecuperarPassword}
                                style={{ width: "240px" }}
                            >
                                Recuperar contraseña
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

export default RecuperarContra;