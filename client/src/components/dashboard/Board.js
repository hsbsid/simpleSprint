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
}) => {
  //create a board state
  const [cardModal, setCardModal] = useState({
    show: false,
    column: null,
    title: null,
  });

  const onCardModalChange = (e) => {
    setCardModal({ ...cardModal, [e.target.name]: e.target.value });
  };

  const addCard = (e, cardData) => {
    e.preventDefault();

    const { title, column } = cardModal;

    //if title is empty
    if (!title || title.trim() === '') {
      return setAlert('Please enter a card title', 'danger');
    }

    onAddCard({ title: title.trim(), column }, board._id);
    closeCardModal();
  };

  const closeCardModal = () => {
    setCardModal({ show: false, column: null, title: null });
  };

  const onDragEnd = () => {
    ///
  };

  return (
    <Fragment>
      <Container>
        <Row id='boardHeader'>
          <h3>{board.title}</h3>
          {owner ? (
            <Button
              className='deleteBoard'
              onClick={(e) => onDeleteBoard(e, board._id)}
            >
              Delete Board <i className='fas fa-trash'></i>
            </Button>
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
            {board.columns.map((col) => (
              <Column
                addCard={() => {
                  setCardModal({ show: true, column: col });
                }}
                title={col}
                cards={board.cards.filter(
                  (card) => card.column.localeCompare(col) === 0
                )}
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

      <Modal id='addCardModal' show={cardModal.show} onHide={closeCardModal}>
        <Modal.Header closeButton>
          Add Card to {`Column: ${cardModal.column}`}
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
    </Fragment>
  );
};

Board.propTypes = { setAlert: PropTypes.func.isRequired };

export default connect(null, { setAlert })(Board);
