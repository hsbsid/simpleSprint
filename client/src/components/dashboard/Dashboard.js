import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

//actions
import {
  getAllBoards,
  getBoard,
  deleteBoard,
  addCard,
  editCard,
} from '../../actions/boards';

//components
import Sidebar from './Sidebar';
import CreateBoard from './CreateBoard';
import Board from './Board';
import Navbar from '../layout/Navbar';
import Loading from '../layout/Loading';

import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Column from './Column';
import Button from 'react-bootstrap/Button';

const Dashboard = ({
  user,
  boards,
  getAllBoards,
  getBoard,
  deleteBoard,
  addCard,
  editCard,
}) => {
  //get board id from the dynamic url
  const { id } = useParams();

  //on load, get board list as well as current board
  useEffect(() => {
    async function loadBoards() {
      await getAllBoards();
      if (id && id !== 'createBoard') {
        await getBoard(id);
      }
    }

    loadBoards();
  }, [id]);

  //state for modals
  const [deleteModal, setDeleteModal] = useState(false);

  //if boards are not being loaded, and no id is provided (in url) OR the board loaded is null (id is invalid)
  if (
    (!boards.loading && !id) ||
    (!boards.board.loading && !boards.board._id)
  ) {
    //if the user has no boards
    if (boards.boards.length == 0) {
      return <Redirect to={`/dashboard/createBoard`} />;
    }

    //get the id for the first board in the list and redirect to it
    const firstId = boards.boards[0]._id;

    return <Redirect to={`/dashboard/${firstId}`} />;
  }

  //delete/remove functions
  const onDeleteBoard = async (e, id) => {
    e.preventDefault();

    setDeleteModal(false);
    await deleteBoard(id);
  };

  const onLeaveBoard = async (e, id) => {
    e.preventDefault();

    console.log(`Removing ${user._id} from Board ${id}`);
  };

  //column add/remove
  const onAddColumn = async (boardId, columnName) => {
    console.log(`Add column ${columnName} to board ${boardId}`);
  };

  const onDeleteColumn = async (boardId, columnName) => {
    console.log(`Remove column ${columnName} from board ${boardId}`);
  };

  //cards
  const onAddCard = async (cardData, boardId) => {
    await addCard(cardData, boardId);
  };

  const onEditCard = async (cardId, cardData) => {
    await editCard(cardId, cardData);
  };

  return !boards.loading ? (
    <Fragment>
      <Container id='Dashboard' fluid>
        <Row>
          <Navbar></Navbar>
        </Row>
        <Row lg={10} md={10}>
          <Col style={{ display: 'flex', overflow: 'hidden' }} lg={2} md={2}>
            <Sidebar loading boardList={boards.boards} />
          </Col>
          <Col id='BoardDisplay' lg={10} md={10}>
            {id === 'createBoard' ? (
              <CreateBoard />
            ) : !boards.board.loading && boards.board ? (
              <Board
                board={boards.board}
                owner={
                  boards.board.users.filter(
                    (u) =>
                      u.user === user._id &&
                      u.permission.localeCompare('Owner') === 0
                  ).length > 0
                }
                onDeleteBoard={(e) => setDeleteModal(true)}
                onLeaveBoard={onLeaveBoard}
                onAddColumn={onAddColumn}
                onDeleteColumn={onDeleteColumn}
                onAddCard={onAddCard}
                onEditCard={onEditCard}
              />
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </Container>
      <Modal show={deleteModal}>
        <Modal.Header>Are you sure?</Modal.Header>
        <Modal.Footer>
          <Button variant='danger' onClick={(e) => onDeleteBoard(e, id)}>
            Yes, delete
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
  ) : (
    <Loading />
  );
};

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired,
  getAllBoards: PropTypes.func.isRequired,
  getBoard: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired,
  addCard: PropTypes.func.isRequired,
  editCard: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  boards: state.boards,
});

export default connect(mapStateToProps, {
  getAllBoards,
  getBoard,
  deleteBoard,
  addCard,
  editCard,
})(Dashboard);
