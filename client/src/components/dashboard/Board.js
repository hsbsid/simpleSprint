import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

//action
import { setAlert } from '../../actions/alert';

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

const Board = ({
  setAlert,
  board,
  owner,
  onDeleteBoard,
  onLeaveBoard,
  onAddCard,
  onEditCard,
}) => {
  //create a board state
  const [cardModal, setCardModal] = useState({
    show: false,
    title: '',
    column: null,
    type: null,
    card: null,
  });

  const [columns, setColumns] = useState(
    board.columns.map((column) => ({
      name: column,
      cards: board.cards.filter((c) => c.column.localeCompare(column) === 0),
    }))
  );

  //update columns when cards change in redux store
  useEffect(
    () =>
      setColumns(
        board.columns.map((column) => ({
          name: column,
          cards: board.cards.filter((c) => c.column.localeCompare(column) == 0),
        }))
      ),
    [board.cards]
  );

  const onCardModalChange = (e) => {
    setCardModal({ ...cardModal, [e.target.name]: e.target.value });
  };

  const addCard = (e) => {
    e.preventDefault();

    const { title, column } = cardModal;

    //if title is empty
    if (!title || title.trim() === '') {
      return setAlert('Please enter a card title', 'danger');
    }

    onAddCard({ title: title.trim(), column }, board._id);
    closeCardModal();
  };

  const editCard = (e, cardId) => {
    e.preventDefault();

    const { title, column } = cardModal;

    //if title is empty
    if (!title || title.trim() === '') {
      return setAlert('Please enter a card title', 'danger');
    }

    onEditCard(cardId, { title: title.trim(), column });
    closeCardModal();
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

    await onEditCard(card._id, { title, column });
  };

  return (
    <Fragment>
      <Container>
        <Row id='boardHeader'>
          <h3>{board.title}</h3>
          {owner ? (
            <p>
              <a
                className='deleteBoard'
                onClick={(e) => onDeleteBoard(e, board._id)}
              >
                Delete Board <i className='fas fa-trash'></i>
              </a>
            </p>
          ) : (
            <Button
              className='deleteBoard'
              onClick={(e) => onLeaveBoard(e, board._id)}
            >
              Leave this board <i className='fas fa-times'></i>
            </Button>
          )}
        </Row>
        <Row lg={4} md={4} className='flex-nowrap' style={{ height: '95%' }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {columns.map(({ name: col, cards }) => (
              <Column
                addCard={() => {
                  setCardModal({
                    ...cardModal,
                    title: '',
                    show: true,
                    column: col,
                    type: 'create',
                    card: null,
                  });
                }}
                editCard={(c) => {
                  setCardModal({
                    ...cardModal,
                    title: c.title,
                    show: true,
                    column: col,
                    type: 'edit',
                    card: c,
                  });
                }}
                deleteCard={(id) => {
                  console.log(`Delete ${id}`);
                }}
                title={col}
                cards={cards}
              />
            ))}
            {owner && (
              <Col className='boardColumn'>
                <h6>Add Column</h6>
                <Button className='addColumn'>
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
          <Form onSubmit={(e) => addCard(e)}>
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
          <Button onClick={(e) => addCard(e)}>Add</Button>
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
          <Form onSubmit={(e) => editCard(e, cardModal.card.id)}>
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
          <Button onClick={(e) => editCard(e, cardModal.card.id)}>
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

Board.propTypes = { setAlert: PropTypes.func.isRequired };

export default connect(null, { setAlert })(Board);
