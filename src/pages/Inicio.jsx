import React from 'react';
import { Card, Col, Row } from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';

const Inicio = () => (
  <Row gutter={16}>

    <Col span={8}>
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

    <Col span={8}>
      <Card variant="borderless">
        <div className="card-titulo">
          <span>Monto total de las Facturas</span>
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

    <Col span={8}>
      <Card variant="borderless">
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
);

export default Inicio;