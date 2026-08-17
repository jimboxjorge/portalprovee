import React, { useState } from 'react';
import logor from '../assets/mcvilllogo.png';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import '../InicioPP.css';
import { AppstoreOutlined, FileTextOutlined, ContainerOutlined, DesktopOutlined, CheckCircleOutlined, MenuFoldOutlined, 
  MenuUnfoldOutlined, PieChartOutlined, LogoutOutlined,} from '@ant-design/icons';
import { Button, Menu } from 'antd';

const items = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: 'Inicio',
  },
  {
    key: '2',
    icon: <FileTextOutlined />,
    label: 'Ordenes de Compra',
  },
  {
    key: '3',
    icon: <DesktopOutlined />,
    label: 'Proveedores',
  },
  {
    key: '4',
    icon: <CheckCircleOutlined />,
    label: 'Autorizacion de Facturas',
  },
  {
    key: '5',
    icon: <ContainerOutlined />,
    label: 'Historico de Facturas',
  },
  {
    key: 'sub1',
    label: 'Administración',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '7',
        label: 'Usuarios',
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Configuración',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '9',
        label: 'Empresa',
      },
      {
        key: '10',
        label: 'Sistema',
      },
    ],
  },
];

function InicioPP() {

  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const cerrarSesion = () => {
    // Limpiar información de sesión
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    // Regresar al Login
    navigate("/");
  };
const rutas = {
  '/inicio': '1',
  '/inicio/ordenesdecompra': '2',
  '/inicio/proveedores': '3',
  '/inicio/autorizaciondefacturas': '4',
  '/inicio/historicodefacturas': '5'
};

const obtenerKeySeleccionada = () => {
  return rutas[location.pathname] || '1';
};

const handleMenuClick = ({ key }) => {

  const rutasNavegacion = {
    '1': '/inicio',
    '2': '/inicio/ordenesdecompra',
    '3': '/inicio/proveedores',
    '4': '/inicio/autorizaciondefacturas',
    '5': '/inicio/historicodefacturas'
  };

  if (rutasNavegacion[key]) {
    navigate(rutasNavegacion[key]);
  }
};
  return (
    <div className="inicio-container">

      {/* Barra superior */}
      <div className="barra-superior">

        {/* Botón menú */}
        <Button
          type="text"
          onClick={toggleCollapsed}
          className="boton-menu">
          {collapsed
            ? <MenuUnfoldOutlined />
            : <MenuFoldOutlined />
          }
        </Button>

        {/* Logo */}
        <img
          src={logor}
          alt="Logo"
          className="logo-superior"
        />

        {/* Cerrar sesión */}
        <Button
          type="text"
          icon={<LogoutOutlined />}
          className="boton-logout"
          onClick={cerrarSesion}>
          Cerrar sesión
        </Button>

      </div>

      {/* Menú lateral */}
      <div
        className="menu-lateral"
        style={{
          width: collapsed ? 80 : 256
        }}>
        <Menu
          selectedKeys={[obtenerKeySeleccionada()]}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
          onClick={handleMenuClick}
        />
      </div>
      <div
        className={`contenido-principal ${
          collapsed ? 'menu-colapsado' : 'menu-expandido'
        }`}
      >
      <div className="contenido-centro">
        <Outlet />
      </div>
</div>
  </div>
  );
}

export default InicioPP;