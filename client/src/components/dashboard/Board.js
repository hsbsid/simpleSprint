import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

//action
import { setAlert } from '../../actions/alert';
//actions
import { addCard, editCard, deleteCard } from '../../actions/boards';

//components
import { DragDropContext } from 'react-beautiful-dnd';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Column from './Column';
import TextEdit from '../inputs/TextEdit';

const Board = ({
  setAlert,
  addCard,
  editCard,
  deleteCard,
  board,
  owner,
  onEditBoard,
  onDeleteBoard,
  onLeaveBoard,
}) => {
  //create states for the modals
  const [cardModal, setCardModal] = useState({
    show: false,
    title: '',
    column: null,
    type: null,
    card: null,
  });

  //state for titleEditing
  const [titleEdit, setTitleEdit] = useState({
    edit: false,
    value: board.title,
  });

  //state for creating column
  const [createColumn, setCreateColumn] = useState({
    edit: false,
    value: 'Enter column title',
  });

  //reset edit state on new board
  useEffect(() => {
    setTitleEdit({ edit: false, value: board.title });
    setCreateColumn({ edit: false, value: 'Enter column title' });
  }, [board]);

  //store columns/cards as component state
  const [columns, setColumns] = useState(
    board.columns.map((column) => ({
      name: column,
      cards: board.cards.filter((c) => c.column.localeCompare(column) === 0),
    }))
  );

  //update columns when cards change in redux store
  useEffect(() => {
    setColumns(
      board.columns.map((column) => ({
        name: column,
        cards: board.cards.filter((c) => c.column.localeCompare(column) == 0),
      }))
    );
  }, [board.cards]);

  //Board Editing ================

  const onTitleSubmit = async (e, newTitle) => {
    e.preventDefault();

    if (newTitle.trim() && newTitle.trim().localeCompare('') !== 0) {
      await onEditBoard(board._id, {
        ...board,
        title: newTitle.trim(),
      });
      setTitleEdit({
        ...newTitle,
        edit: false,
        value: newTitle.trim(),
      });
    } else {
      setTitleEdit({ edit: false, value: board.title });
    }
  };

  const onColumnSubmit = async (e, newColumnTitle) => {
    e.preventDefault();

    if (
      newColumnTitle.trim() &&
      newColumnTitle.trim().localeCompare('') !== 0
    ) {
      console.log(newColumnTitle);
      await onEditBoard(board._id, {
        ...board,
        columns: [...board.columns, newColumnTitle.trim()],
      });
    }

    setTitleEdit({ edit: false, value: 'Enter column title' });
  };

  // Card adding/editing/deleting ==================
  const onAddCard = async (e) => {
    e.preventDefault();

    const { title, column } = cardModal;

    //if title is empty
    if (!title || title.trim() === '') {
      return setAlert('Please enter a card title', 'danger');
    }

    await addCard({ title: title.trim(), column }, board._id);
    closeCardModal();
  };

  const onEditCard = async (e, cardId) => {
    const { title, column } = cardModal;

    //if title is empty
    if (!title || title.trim() === '') {
      return setAlert('Please enter a card title', 'danger');
    }

    await editCard(cardId, { title: title.trim(), column });
    closeCardModal();
  };

  const onDeleteCard = async (e, cardId) => {
    e.preventDefault();

    await deleteCard(cardId);
    closeCardModal();
  };

  //Card Modal =================
  const onCardModalChange = (e) => {
    setCardModal({ ...cardModal, [e.target.name]: e.target.value });
  };

  const closeCardModal = () => {
    setCardModal({
      ...cardModal,
      show: false,
      column: null,
      title: '',
      card: null,
      type: null,
    });
  };

  // Drag and Drop =================
  const onDragEnd = async ({ draggableId, source, destination }) => {
    //if there is no destination, or if destination is the same as source, do nothing
    if (!destination || destination.droppableId == source.droppableId) return;

    //get the card
    const card = board.cards.find(
      (c) => c._id.localeCompare(draggableId) === 0
    );

    //update the component state
    //shallow copy columns
    const newColumns = [...columns];

    const srcColumn = newColumns.find(
      (c) => c.name.localeCompare(source.droppableId) == 0
    ); //remove the card from the source array

    srcColumn.cards.splice(source.index, 1);

    const destColumn = newColumns.find(
      (c) => c.name.localeCompare(destination.droppableId) == 0
    );

    destColumn.cards.splice(destination.index, 0, card);

    setColumns([...newColumns]);

    const title = card.title;

    const column = destination.droppableId;

    await editCard(card._id, { title, column });
  };

  return (
    <Fragment>
      <Container>
        <Row id='boardHeader'>
          {titleEdit.edit ? (
            <TextEdit
              customClasses='editTitle'
              onSubmit={(e, title) => onTitleSubmit(e, title)}
              onChange={(e, editTitle) =>
                setTitleEdit({ ...titleEdit, value: editTitle })
              }
              onExit={() => setTitleEdit({ ...titleEdit, edit: false })}
              onBlur={() =>
                setTitleEdit({ ...titleEdit, value: board.title, edit: false })
              }
              editValue={titleEdit.value}
            />
          ) : (
            <h3>
              {board.title}
              <i
                class='fas fa-pencil'
                onClick={() => setTitleEdit({ ...titleEdit, edit: true })}
              ></i>
            </h3>
          )}
          {owner ? (
            <p>
              <a
                className='deleteBoard'
                onClick={(e) => onDeleteBoard(board._id, 'Delete')}
              >
                Delete Board <i className='fas fa-trash'></i>
              </a>
            </p>
          ) : (
            <p>
              <a
                className='deleteBoard'
                onClick={(e) => onDeleteBoard(board._id, 'Leave')}
              >
                Leave this Board <i className='fas fa-times'></i>
              </a>
            </p>
          )}
        </Row>
        <Row lg={4} md={4} className='flex-nowrap' style={{ height: '95%' }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {columns.map(({ name: col, cards }) => (
              <Column
                onAddCard={() => {
                  setCardModal({
                    ...cardModal,
                    title: '',
                    show: true,
                    column: col,
                    type: 'create',
                    card: null,
                  });
                }}
                onEditCard={(c) => {
                  setCardModal({
                    ...cardModal,
                    title: c.title,
                    show: true,
                    column: col,
                    type: 'edit',
                    card: c,
                  });
                }}
                onDeleteCard={(e, id) => onDeleteCard(e, id)}
                title={col}
                cards={cards}
              />
            ))}
            {owner && (
              <Col className='boardColumn'>
                {createColumn.edit ? (
                  <TextEdit
                    customClasses='newColumnEdit'
                    onSubmit={(e, columnTitle) => {
                      console.log(columnTitle);
                      onColumnSubmit(e, columnTitle);
                    }}
                    onChange={(e, columnTitle) =>
                      setCreateColumn({ ...createColumn, value: columnTitle })
                    }
                    onExit={() =>
                      setCreateColumn({ ...createColumn, edit: false })
                    }
                    onBlur={() =>
                      setCreateColumn({
                        ...createColumn,
                        value: 'Enter column title',
                        edit: false,
                      })
                    }
                    editValue={createColumn.value}
                  />
                ) : (
                  <h6>Add Column</h6>
                )}

                <Button
                  className='addColumn'
                  onClick={(e) =>
                    setCreateColumn({ ...createColumn, edit: true })
                  }
                >
                  <i className='fas fa-plus'></i>
                </Button>
              </Col>
            )}
          </DragDropContext>
        </Row>
      </Container>

      <Modal
        id='addCardModal'
        show={cardModal.show && cardModal.type.localeCompare('create') === 0}
        onHide={closeCardModal}
      >
        <Modal.Header closeButton>
          Add Card to {`${cardModal.column}`}
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => onAddCard(e)}>
            <FloatingLabel label='Card Title'>
              <Form.Control
                name='title'
                value={cardModal.title}
                type='text'
                onChange={(e) => onCardModalChange(e)}
                required
              ></Form.Control>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => onAddCard(e)}>Add</Button>
          <Button variant='outline-danger' onClick={closeCardModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        id='addCardModal'
        show={cardModal.show && cardModal.type.localeCompare('edit') === 0}
        onHide={closeCardModal}
      >
        <Modal.Header closeButton>Edit Card</Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => onEditCard(e, cardModal.card.id)}>
            <FloatingLabel label='Card Title'>
              <Form.Control
                name='title'
                value={cardModal.title}
                type='text'
                onChange={(e) => onCardModalChange(e)}
                required
              ></Form.Control>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => onEditCard(e, cardModal.card.id)}>
            Update
          </Button>
          <Button variant='outline-danger' onClick={closeCardModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

Board.propTypes = {
  setAlert: PropTypes.func.isRequired,
  addCard: PropTypes.func.isRequired,
  editCard: PropTypes.func.isRequired,
  deleteCard: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, addCard, editCard, deleteCard })(
  Board
);
