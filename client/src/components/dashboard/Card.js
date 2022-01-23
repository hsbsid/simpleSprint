import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

//components
import { Draggable } from 'react-beautiful-dnd';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import Overlay from 'react-bootstrap/Overlay';

const Card = (props) => {
  const { title, id, index, onEditCard, onDeleteCard } = props;

  const [deletePopover, setDeletePopover] = useState(false);

  const confirmDeletePopover = (
    <Popover id='popover-basic'>
      <Popover.Body>Are you sure?</Popover.Body>
      <Popover.Body>
        <Button
          variant='danger'
          onClick={(e) => {
            onDeleteCard(e, id);
            setDeletePopover(false);
          }}
        >
          Yes, Delete
        </Button>
      </Popover.Body>
    </Popover>
  );

  const target = React.createRef();

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
              <Overlay
                rootClose={true}
                target={target}
                show={deletePopover}
                placement='top'
                overlay={confirmDeletePopover}
                onHide={() => setDeletePopover(false)}
              >
                {confirmDeletePopover}
              </Overlay>
              <i
                ref={target}
                onClick={() => setDeletePopover(true)}
                className='fas fa-trash'
              ></i>
            </div>
          </div>
        )}
      </Draggable>
    </Fragment>
  );
};

Card.propTypes = {};

export default Card;
