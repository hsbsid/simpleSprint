import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

//components
import { Draggable } from 'react-beautiful-dnd';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const Card = (props) => {
  const { title, id, index, onEditCard, onDeleteCard } = props;

  const [deletePopover, setDeletePopover] = useState(false);

  const confirmDeletePopover = (
    <Popover id='popover-basic'>
      <Popover.Body>Are you sure?</Popover.Body>
      <Popover.Body>
        <Button
          variant='danger'
          onClick={() => {
            onDeleteCard(id);
            setDeletePopover(false);
          }}
        >
          Yes, Delete
        </Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <Fragment>
      <Draggable draggableId={id} key={id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`boardCard ${snapshot.isDragging && 'isDragging'}`}
          >
            <h6>{title}</h6>
            <div>
              <i
                className='fas fa-pencil'
                onClick={() => onEditCard({ id, title })}
              ></i>
              <OverlayTrigger
                rootClose
                show={deletePopover}
                placement='top'
                overlay={confirmDeletePopover}
              >
                <i
                  // onClick={() => setDeletePopover(true)}
                  className='fas fa-trash'
                ></i>
              </OverlayTrigger>
            </div>
          </div>
        )}
      </Draggable>
    </Fragment>
  );
};

Card.propTypes = {};

export default Card;
