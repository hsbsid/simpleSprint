import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

//actions
import {
  getAllBoards,
  getBoard,
  deleteBoard,
  editBoard,
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
  editBoard,
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
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: null,
    id: null,
  });

  //if boards are not being loaded and:
  //no id is provided
  //or the id does not exist in the list of boards (and is not 'createBoard')
  //or the board loaded is undefined/null
  //then redirect to the first board in the user's list of boards
  if (
    (!boards.loading &&
      (!id ||
        (id.localeCompare('createBoard') != 0 &&
          !boards.boards.find((b) => b._id == id)))) ||
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

  //edit board
  const onEditBoard = async (boardId, newBoardData) => {
    await editBoard(boardId, newBoardData);
  };

  //delete/remove functions
  const onDeleteBoard = async (e, id) => {
    e.preventDefault();

    setDeleteModal({ show: false, type: null, id: null });
    await deleteBoard(id);
  };

  return !boards.loading ? (
    <Fragment>
      <Container id='Dashboard' fluid>
        <Row fluid>
          <Col className='col' lg={2} md={2} style={{ display: 'flex' }}>
            <Sidebar
              loading
              boardList={boards.boards.sort(
                (a, b) => new Date(a.date) < new Date(b.date)
              )}
            />
          </Col>
          <Col className='col' style={{ padding: 0 }}>
            <Row>
              <Navbar></Navbar>
            </Row>
            <Row id='BoardDisplay'>
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
                  onEditBoard={(id, data) => onEditBoard(id, data)}
                  onDeleteBoard={(id, type) =>
                    setDeleteModal({ show: true, type: type, id: id })
                  }
                  onLeaveBoard={(id, type) =>
                    setDeleteModal({ show: true, type: type, id: id })
                  }
                />
              ) : (
                <Loading />
              )}
            </Row>
          </Col>
        </Row>
      </Container>

      <Modal show={deleteModal.show}>
        <Modal.Header>Are you sure?</Modal.Header>
        <Modal.Footer>
          <Button
            variant='danger'
            onClick={(e) => onDeleteBoard(e, deleteModal.id)}
          >
            {`Yes, ${deleteModal.type}`}
          </Button>
          <Button
            variant='outline-primary'
            onClick={() =>
              setDeleteModal({ show: false, type: null, id: null })
            }
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
  editBoard: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  boards: state.boards,
});

export default connect(mapStateToProps, {
  getAllBoards,
  getBoard,
  deleteBoard,
  editBoard,
})(Dashboard);
