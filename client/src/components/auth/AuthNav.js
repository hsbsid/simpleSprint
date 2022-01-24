import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';

const AuthNav = (props) => {
  return (
    <Nav
      variant='pills'
      defaultActiveKey={window.location.pathname}
      className='justify-content-center'
    >
      <Nav.Link
        eventKey='/login'
        as={() => (
          <Link
            to='/login'
            className={`nav-link ${
              window.location.pathname == '/login' ? 'active' : ''
            }`}
          >
            Log In
          </Link>
        )}
      ></Nav.Link>

      <Nav.Link
        eventKey='/login'
        as={() => (
          <Link
            className={`nav-link ${
              window.location.pathname == '/signup' ? 'active' : ''
            }`}
            to='/signup'
          >
            Sign Up
          </Link>
        )}
      ></Nav.Link>

      <Nav.Link
        eventKey='/demoUser'
        as={() => (
          <Link
            className={`nav-link ${
              window.location.pathname == '/demoUser' ? 'active' : ''
            }`}
            to='/demoUser'
          >
            Demo Account
          </Link>
        )}
      ></Nav.Link>
    </Nav>
  );
};

AuthNav.propTypes = {};

export default AuthNav;
