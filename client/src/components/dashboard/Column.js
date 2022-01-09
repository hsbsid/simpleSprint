import React from 'react';
import PropTypes from 'prop-types';

//components
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Column = (props) => {
  return (
    <Col className='boardColumn'>
      <h6>{props.title}</h6>
      <Container bg='blue-100'></Container>
    </Col>
  );
};

Column.propTypes = {};

export default Column;
