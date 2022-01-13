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
        <div className='dropdown'>
          <a
            href='#'
            className='d-flex align-items-center text-white text-decoration-none dropdown-toggle'
            id='dropdownUser1'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            <strong>mdo</strong>
          </a>
          <ul
            className='dropdown-menu dropdown-menu-dark text-small shadow'
            aria-labelledby='dropdownUser1'
          >
            <li>
              <a className='dropdown-item' href='#'>
                New project...
              </a>
            </li>
            <li>
              <a className='dropdown-item' href='#'>
                Settings
              </a>
            </li>
            <li>
              <a className='dropdown-item' href='#'>
                Profile
              </a>
            </li>
            <li>
              <hr className='dropdown-divider' />
            </li>
            <li>
              <a className='dropdown-item' href='#'>
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

Sidebar.propTypes = {};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps)(Sidebar);
