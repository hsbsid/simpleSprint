import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Column from './Column';

const Board = ({ board, owner, onDeleteBoard, onRemoveFromBoard }) => {
  return (
    <Fragment>
      <Container>
        <Row>
          <h3>{board.title}</h3>
          {owner ? (
            <button
              className='deleteBoard'
              onClick={(e) => onDeleteBoard(e, board._id)}
            >
              Delete Board <i className='fas fa-trash'></i>
            </button>
          ) : (
            <button
              className='deleteBoard'
              onClick={(e) => onRemoveFromBoard(e, board._id)}
            >
              Leave this board <i className='fas fa-times'></i>
            </button>
          )}
        </Row>
        <Row lg={4} md={4} className='flex-nowrap' style={{ height: '95%' }}>
          {board.columns.map((c) => (
            <Column title={c} />
          ))}
          <Column title='Add a new Column' />
        </Row>
      </Container>
    </Fragment>
  );
};

Board.propTypes = {};

export default Board;
