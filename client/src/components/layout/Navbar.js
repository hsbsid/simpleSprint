import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//actions
import { logout } from '../../actions/auth';

//components
import BSNavbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

const Navbar = ({ auth, logout }) => {
  if (!auth.loading && auth.authenticated) {
    return (
      <Fragment>
        <BSNavbar sticky='top' className='navbar-light' id='Navbar'>
          <Container className='d-flex flex-row justify-content-between'>
            <BSNavbar.Brand>simpleSprint</BSNavbar.Brand>
            <Nav className='me-auto'>
              <Nav.Link key={1}>
                <Link className='nav-link' to='/dashboard'>
                  Dashboard
                </Link>
              </Nav.Link>
              <Nav.Link key={2} onClick={logout}>
                <Link className='nav-link' to='/login'>
                  Logout
                </Link>
              </Nav.Link>
            </Nav>
          </Container>
        </BSNavbar>
      </Fragment>
    );
  } else {
    return <Fragment></Fragment>;
  }
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, { logout })(Navbar);
