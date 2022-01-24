import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//actions
import { logout } from '../../actions/auth';

//components
import BSNavbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';

const Navbar = ({ auth, logout }) => {
  if (!auth.loading && auth.authenticated) {
    return (
      <Fragment>
        <BSNavbar sticky='top' className='navbar-light' id='Navbar'>
          <Container>
            <h1 id='logo'>
              simpleSprint<Badge bg='primary'>Demo</Badge>
            </h1>
            <Dropdown>
              <Dropdown.Toggle className='avatarBox'>
                <div className='avatar'>{auth.user.name[0]}</div>
                <div>{auth.user.name}</div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href='#/action-1'>
                  <Link className='nav-link' to='/login' onClick={logout}>
                    Logout
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
