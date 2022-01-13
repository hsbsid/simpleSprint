import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

//actions
import { getAllBoards, getBoard } from '../../actions/boards';

//components
import Sidebar from './Sidebar';
import Navbar from '../layout/Navbar';
import Loading from '../layout/Loading';

import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Column from './Column';

const Dashboard = ({ boards, getAllBoards, getBoard }) => {
  //get board id from the dynamic url
  const { id } = useParams();

  //on load, get board list as well as current board
  useEffect(() => {
    getAllBoards();
    if (id) {
      getBoard(id);
    }
  }, [id]);

  const columns = ['Backlog', 'In Progress', 'Done'];

  if (!boards.loading && !id) {
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
            {!boards.board.loading ? (
              <Container>
                <Row>
                  <h2>{boards.board.title}</h2>
                </Row>
                <Row
                  lg={4}
                  md={4}
                  className='flex-nowrap'
                  style={{ height: '95%' }}
                >
                  {boards.board.columns.map((c) => (
                    <Column title={c} />
                  ))}
                  <Column title='Add a new Column' />
                </Row>
              </Container>
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
