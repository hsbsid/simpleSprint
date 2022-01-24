import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Sidebar = ({ boardList }) => {
  return (
    <Fragment>
      <div
        className='d-flex flex-column flex-shrink-0 p-3 text-white flex-grow-1'
        id='Sidebar'
      >
        <ul className='nav nav-pills flex-column mb-auto'>
          <li key='title' style={{ fontSize: '12px', color: 'darkgrey' }}>
            MY BOARDS
          </li>
          {boardList.map((board) => (
            <li
              key={board._id}
              className={`nav-link ${
                window.location.pathname.includes(board._id) && 'selected'
              }`}
            >
              <Link to={board._id}>{board.title}</Link>
            </li>
          ))}
          <li key='createBoard'>
            <Link to='createBoard' className='nav-link'>
              <i class='fas fa-plus'></i> New Board
            </Link>
          </li>
        </ul>
        <hr />
      </div>
    </Fragment>
  );
};

Sidebar.propTypes = {};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps)(Sidebar);
