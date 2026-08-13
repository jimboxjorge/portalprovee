import React, { useEffect, useRef, useState} from 'react';
import { SearchOutlined, PlusOutlined} from '@ant-design/icons';
import { Button, Input, Space, Table, message} from 'antd';
import Highlighter from 'react-highlight-words';
import '../Proveedores.css';

const Proveedores = () => {

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const response = await fetch(
        'https://localhost:7231/api/Proveedores'
      );

      if (!response.ok) {
        throw new Error(
          'Error al consultar proveedores'
        );
      }

      const proveedores =
        await response.json();

      const proveedoresTabla =
        proveedores.map(proveedor => ({
          key: proveedor.idProveedor,
          idProveedor:
            proveedor.idProveedor,
          name:
            proveedor.nombre,
          rfc:
            proveedor.rfc,
          address:
            proveedor.correo,
          nuevo: false

        }));

      setData(proveedoresTabla);

    } catch (error) {

      console.error(error);

      message.error('No se pudieron cargar los proveedores');
    }
  };

  const agregarProveedor = () => 
    {
      const nuevoProveedor = {
      key:
          `nuevo-${Date.now()}`,
      idProveedor:
          null,
      name:
          '',
      rfc:
          '',
      address:
          '',
      nuevo:
          true
      };

      setData(prevData => [
      ...prevData,
      nuevoProveedor
      ]);
    };

  const actualizarProveedor = ( key, campo, valor) => 
    {
      setData(prevData =>

      prevData.map(proveedor => {

          if (proveedor.key === key) {

          return {
              ...proveedor,
              [campo]:
              valor
          };
          }
          return proveedor;
      })
      );
    };

  const guardarProveedores = async () => {

    const nuevos =
      data.filter(
        proveedor =>
          proveedor.nuevo
      );

    if (nuevos.length === 0) {
      message.info('No hay proveedores nuevos para guardar');
      return;
    }

    try {

      for (const proveedor of nuevos) {

        if (!proveedor.name.trim()) {
          message.warning('El nombre del proveedor es obligatorio.');
          return;
        }

        if (!proveedor.rfc.trim()) {
          message.warning('El RFC es obligatorio.');
          return;
        }

        if (!proveedor.address.trim()) {
          message.warning('El correo es obligatorio.');
          return;
        }

        const response =
          await fetch(
            'https://localhost:7231/api/Proveedores',
            {

              method:
                'POST',

              headers: {

                'Content-Type':
                  'application/json'

              },

              body:
                JSON.stringify({

                  nombre:
                    proveedor.name,

                  rfc:
                    proveedor.rfc,

                  correo:
                    proveedor.address

                })

            }
          );

        const resultado =
          await response.json();

        if (!response.ok) {
          message.error(resultado.mensaje ||'Error al guardar el proveedor');
          return;
        }
      }

      message.success('Proveedores guardados correctamente');
      await cargarProveedores();

    } catch (error) {
      console.error(error);
      message.error('No se pudieron guardar los proveedores');
    }

  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => 
    {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

  const handleReset =
    clearFilters => {
      clearFilters();
      setSearchText('');
    };

  const getColumnSearchProps =
    dataIndex => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close
      }) => (

        <div style={{padding: 8}}
          onKeyDown={
            e =>
              e.stopPropagation()
          }
        >

          <Input
            ref={searchInput}

            placeholder={`Buscar ${dataIndex}`}

            value={selectedKeys[0]}

            onChange={
              e =>
                setSelectedKeys(

                  e.target.value
                    ? [e.target.value]
                    : []

                )
            }

            onPressEnter={
              () =>
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
              onClick={
                () =>
                  handleSearch(
                    selectedKeys,
                    confirm,
                    dataIndex
                  )
              }
              icon={
                <SearchOutlined />
              }
              size="small"
            >
              Buscar
            </Button>

            <Button
              onClick={
                () =>
                  clearFilters &&
                  handleReset(
                    clearFilters
                  )
              }
              size="small"
            >
              Limpiar
            </Button>

            <Button
              type="link"
              size="small"
              onClick={
                () =>
                  close()
              }

            >
              Cerrar
            </Button>
          </Space>
        </div>
      ),

      filterIcon:
        filtered => (

          <SearchOutlined
            style={{
              color:
                filtered
                  ? '#1677ff'
                  : undefined

            }}/>
        ),

      onFilter:
        (value, record) => {

          const valor =
            record[dataIndex];

          if (!valor) {
            return false;
          }

          return valor
            .toString()
            .toLowerCase()
            .includes(
              value.toLowerCase()
            );
        },

      filterDropdownProps: {

        onOpenChange:
          open => {
            if (open) {
              setTimeout(
                () =>
                  searchInput
                    .current
                    ?.select(),
                100
              );
            }
          }
      },

      render:
        text =>
          searchedColumn ===
          dataIndex
            ? (
              <Highlighter
                highlightStyle={{
                  backgroundColor:
                    '#ffc069',
                  padding: 0
                }}
                searchWords={[
                  searchText
                ]}
                autoEscape
                textToHighlight={
                  text
                    ? text.toString()
                    : ''
                }
              />
            )
            : (
              text
            )
    });

  const columns = [
    {

      title:
        'Nombre',
      dataIndex:
        'name',
      key:
        'name',
      width:
        '30%',

      ...getColumnSearchProps(
        'name'
      ),

      render:
        (text, record) => {

          if (
            record.nuevo
          ) {
            return (
              <Input
                value={
                  text
                }
                placeholder={
                  'Nombre del proveedor'
                }
                onChange={
                  e =>
                    actualizarProveedor(
                      record.key,
                      'name',
                      e.target.value
                    )
                }
              />
            );
          }
          return text;
        }
    },
    {

      title:
        'RFC',
      dataIndex:
        'rfc',
      key:
        'rfc',
      width:
        '25%',

      ...getColumnSearchProps(
        'rfc'
      ),
      render:
        (text, record) => {

          if (
            record.nuevo
          ) {
            return (
              <Input
                value={
                  text
                }
                placeholder={
                  'RFC'
                }
                onChange={
                  e =>
                    actualizarProveedor(
                      record.key,
                      'rfc',
                      e.target.value
                    )
                }
              />
            );
          }
          return text;
        }
    },

    {
      title:
        'Correo',
      dataIndex:
        'address',
      key:
        'address',
      width:
        '35%',
      ...getColumnSearchProps(
        'address'
      ),

      render:
        (text, record) => {

          if (
            record.nuevo
          ) {
            return (
              <Input
                value={
                  text
                }
                placeholder={
                  'Correo electrónico'
                }
                onChange={
                  e =>
                    actualizarProveedor(
                      record.key,
                      'address',
                      e.target.value
                    )
                }
              />
            );
          }
          return text;
        }
    }
  ];

  return (

    <div
      className="pagina"
    >
      <h1>
        Proveedores
      </h1>
      <div
        className="acciones-tabla"
      >
        <Button
          type="primary"
          icon={
            <PlusOutlined />
          }
          onClick={
            agregarProveedor
          }
        >
          Agregar proveedor
        </Button>

        <Button
          style={{
            backgroundColor:
              '#1bc058',
            borderColor:
              '#16A34A',
            color:
              'white'
          }}
          icon={
            <PlusOutlined />
          }
          onClick={
            guardarProveedores
          }
        >
          Guardar proveedor
        </Button>
      </div>
      <Table
        columns={
          columns
        }
        dataSource={
          data
        }
        rowKey="key"
      />
    </div>
  );
};

export default Proveedores;