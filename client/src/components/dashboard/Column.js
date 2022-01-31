import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

//components
import { Droppable } from 'react-beautiful-dnd';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from '../dashboard/Card';
import TextEdit from '../inputs/TextEdit';
import Modal from 'react-bootstrap/Modal';

const Column = (props) => {
  const [editColumn, setEditColumn] = useState({
    edit: false,
    value: props.title,
  });

  const resetEditColumn = () => {
    setEditColumn({ ...editColumn, edit: false });
  };

  const [deleteModal, setDeleteModal] = useState(false);

  const onDeleteColumn = () => {};

  return (
    <Fragment>
      <Col className='boardColumn'>
        {editColumn.edit ? (
          <TextEdit
            customClasses='columnEdit'
            onSubmit={(e) => {
              props.onEditTitle(e, props.title, editColumn.value);
              resetEditColumn();
            }}
            onChange={(e, columnTitle) => {
              setEditColumn({
                ...editColumn,
                value: columnTitle.toLowerCase(),
              });
            }}
            onExit={() => resetEditColumn()}
            onBlur={() => resetEditColumn()}
            editValue={editColumn.value}
          />
        ) : (
          <h6>
            {props.title}
            {props.owner && (
              <Fragment>
                <i
                  className='fas fa-pencil'
                  onClick={(e) => setEditColumn({ ...editColumn, edit: true })}
                ></i>
                <i
                  className='fas fa-trash'
                  onClick={(e) => setDeleteModal(true)}
                ></i>{' '}
              </Fragment>
            )}
          </h6>
        )}
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
                  date={c.date}
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

      <Modal show={deleteModal}>
        <Modal.Header>Are you sure?</Modal.Header>
        <Modal.Body>Deleting this column will remove all its cards.</Modal.Body>
        <Modal.Footer>
          <Button
            variant='danger'
            onClick={(e) => {
              props.onDeleteColumn(e);
              setDeleteModal(false);
            }}
          >
            Delete
          </Button>
          <Button
            variant='outline-primary'
            onClick={() => setDeleteModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

Column.propTypes = {};

export default Column;
