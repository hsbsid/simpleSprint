import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

//actions
import { getAllBoards, getBoard } from '../../actions/boards';

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

const Dashboard = ({ boards, getAllBoards, getBoard }) => {
  //get board id from the dynamic url
  const { id } = useParams();

  //on load, get board list as well as current board
  useEffect(() => {
    getAllBoards();
    if (id && id !== 'createBoard') {
      getBoard(id);
    }
  }, [id]);

  if (!boards.loading && !id) {
    //if the user has no boards
    if (boards.boards.length == 0) {
      return <Redirect to={`/dashboard/createBoard`} />;
    }

    //get the id for the first board in the list
    const firstId = boards.boards[0]._id;

    return <Redirect to={`/dashboard/${firstId}`} />;
  }

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
            ) : !boards.board.loading ? (
              <Board board={boards.board} />
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </Container>
    </Fragment>
  ) : (
    <Fragment>
      <Loading />
    </Fragment>
  );
};

Dashboard.propTypes = {
  boards: PropTypes.object.isRequired,
  getAllBoards: PropTypes.func.isRequired,
  getBoard: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ boards: state.boards });

export default connect(mapStateToProps, { getAllBoards, getBoard })(Dashboard);
