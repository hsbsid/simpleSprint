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
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            className={`container ${
              snapshot.isDraggingOver && 'isDraggingOver'
            }`}
            bg='blue-100'
            ref={provided.innerRef}
          >
            {props.cards.map((c, index) => (
              <Card
                id={c._id}
                title={c.title}
                index={index}
                onEditCard={(c) => props.onEditCard(c)}
                onDeleteCard={(e, id) => props.onDeleteCard(e, id)}
              ></Card>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <a onClick={() => props.onAddCard()}>
        <i className='fas fa-plus'></i> Add Card
      </a>
    </Col>
  );
};

Column.propTypes = {};

export default Column;
