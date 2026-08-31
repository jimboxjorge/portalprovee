import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CrearCuenta from "./pages/CrearCuenta";
import RecuperarContra from "./pages/RecuperarContra";
import GenerarNuevaContra from "./pages/GenerarNuevaContra";

import InicioPP from "./pages/InicioPP";
import Inicio from "./pages/Inicio";
import Ordenes_de_Compra from "./pages/Ordenes_de_Compra";
import Autorizacion_de_facturas from "./pages/Autorizacion_de_facturas";
import Historico_de_facturas from "./pages/Historico_de_facturas";
import Proveedores from "./pages/Proveedores";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/registro" element={<CrearCuenta />} />

        <Route
          path="/recuperarcontra"
          element={<RecuperarContra />}
        />

        <Route
          path="/generarNuevaContra/:token"
          element={<GenerarNuevaContra />}
        />


        <Route element={<ProtectedRoute />}>

          {/* Layout principal */}
          <Route path="/inicio" element={<InicioPP />}>

            {/* Inicio */}
            <Route index element={<Inicio />} />

            {/* Órdenes de compra */}
            <Route
              path="ordenesdecompra"
              element={<Ordenes_de_Compra />}
            />

            {/* Proveedores */}
            <Route
              path="proveedores"
              element={<Proveedores />}
            />

            {/* Autorización de facturas */}
            <Route
              path="autorizaciondefacturas"
              element={<Autorizacion_de_facturas />}
            />

            {/* Histórico de facturas */}
            <Route
              path="historicodefacturas"
              element={<Historico_de_facturas />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;