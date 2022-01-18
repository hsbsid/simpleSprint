import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

//components
import { Draggable } from 'react-beautiful-dnd';

const Card = (props) => {
  const { title, id, index } = props;

  return (
    <Draggable draggableId={id} key={index} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className='boardCard'
        >
          <h6>{title}</h6>
          <i className='fas fa-pencil'></i>
          <i className='fas fa-trash'></i>
        </div>
      )}
    </Draggable>
  );
};

Card.propTypes = {};

export default Card;
