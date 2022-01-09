import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

//components
import Sidebar from './Sidebar';
import Navbar from '../layout/Navbar';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Column from './Column';

const Dashboard = (props) => {
  const boardTitle = 'Board A';

  const columns = ['Backlog', 'In Progress', 'Done'];
  return (
    <Fragment>
      <Container id='Dashboard' fluid>
        <Row>
          <Navbar></Navbar>
        </Row>
        <Row lg={10} md={10}>
          <Col style={{ display: 'flex', overflow: 'hidden' }} lg={2} md={2}>
            <Sidebar />
          </Col>
          <Col id='DisplayArea' lg={10} md={10}>
            <Container>
              <Row>
                <h2>{boardTitle}</h2>
              </Row>
              <Row
                lg={4}
                md={4}
                className='flex-nowrap'
                style={{ height: '95%' }}
              >
                {columns.map((c) => (
                  <Column title={c} />
                ))}
                <Column title='Add a new Column' />
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
