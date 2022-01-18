import React from 'react';
import PropTypes from 'prop-types';

//components
import { Droppable } from 'react-beautiful-dnd';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from '../dashboard/Card';

const Column = (props) => {
  return (
    <Col className='boardColumn'>
      <h6>{props.title}</h6>
      <Droppable droppableId={props.title}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            className='container'
            bg='blue-100'
            ref={provided.innerRef}
          >
            {props.cards.map((c, index) => (
              <Card id={c._id} title={c.title} index={index}></Card>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <a onClick={() => props.addCard()}>
        <i className='fas fa-plus'></i> Add Card
      </a>
    </Col>
  );
};

Column.propTypes = {};

export default Column;
