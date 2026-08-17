import React, { useRef, useState } from 'react';
import { Card, Col, Row, Button, Input, Space, Table} from 'antd';
import { FileTextOutlined, DollarOutlined, ShoppingCartOutlined, SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import '../Inicio.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend} from 'chart.js';
import { Line } from 'react-chartjs-2';

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);
const opcionesGrafica = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Facturas por mes',
    },
  },
};

const datosGrafica = {
  labels: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio'
  ],
  datasets: [
    {
      fill: true,
      label: 'Facturas',
      data: [120, 190, 150, 280, 220, 310, 260],
      borderColor: 'rgb(37, 99, 235)',
      backgroundColor: 'rgba(37, 99, 235, 0.15)',
    },
  ],
};
const Inicio = () => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={e => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(
              e.target.value ? [e.target.value] : []
            )
          }
          onPressEnter={() =>
            handleSearch(
              selectedKeys,
              confirm,
              dataIndex
            )
          }
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                selectedKeys,
                confirm,
                dataIndex
              )
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>

          <Button
            onClick={() =>
              clearFilters &&
              handleReset(clearFilters)
            }
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => close()}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),

    filterIcon: filtered => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined
        }}
      />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),

    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => {
            searchInput.current?.select();
          }, 100);
        }
      },
    },

    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={
            text ? text.toString() : ''
          }
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Edad',
      dataIndex: 'age',
      key: 'age',
      width: '20%',
      ...getColumnSearchProps('age'),
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address'),
      sorter: (a, b) =>
        a.address.length - b.address.length,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  return (
    <>
      {/* CARDS */}
      <Row gutter={[16, 16]}>

        <Col span={6}>
          <Card
            variant="borderless"
            className="card-dashboard"
          >
            <div className="card-titulo">
              <span>Total de Facturas</span>

              <div className="titulo-linea">
                <span></span>
                <FileTextOutlined />
              </div>
            </div>

            <div className="card-valor">
              25
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card
            variant="borderless"
            className="card-dashboard"
          >
            <div className="card-titulo">
              <span>Monto total de Facturas</span>

              <div className="titulo-linea">
                <span></span>
                <DollarOutlined />
              </div>
            </div>

            <div className="card-valor">
              $18,500.00
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card
            variant="borderless"
            className="card-dashboard"
          >
            <div className="card-titulo">
              <span>Total de Pedidos</span>

              <div className="titulo-linea">
                <span></span>
                <ShoppingCartOutlined />
              </div>
            </div>

            <div className="card-valor">
              10
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card
            variant="borderless"
            className="card-dashboard"
          >
            <div className="card-titulo">
              <span>Total de Pedidos</span>

              <div className="titulo-linea">
                <span></span>
                <ShoppingCartOutlined />
              </div>
            </div>

            <div className="card-valor">
              10
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="fila-tabla">

        {/* TABLA */}
        <Col span={12} className="columna-tabla">
          <div className="contenedor-tabla">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </div>
        </Col>

        {/* GRÁFICA */}
        <Col span={12}>
          <div className="contenedor-grafica">
            <Line
              options={opcionesGrafica}
              data={datosGrafica}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Inicio;