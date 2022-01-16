import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Sidebar = ({ boardList }) => {
  return (
    <Fragment>
      <div
        className='d-flex flex-column flex-shrink-0 p-3 text-white bg-light flex-grow-1'
        id='Sidebar'
      >
        <ul className='nav nav-pills flex-column mb-auto'>
          <li style={{ fontSize: '12px', color: 'darkgrey' }}>MY BOARDS</li>
          {boardList.map((board) => (
            <li>
              <Link to={board._id} className='nav-link'>
                {board.title}
              </Link>
            </li>
          ))}
          <li>
            <Link to='createBoard' className='nav-link'>
              + New Board
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
