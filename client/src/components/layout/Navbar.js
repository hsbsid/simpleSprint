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
import SearchBar from '../inputs/SearchBar';

const Navbar = ({ auth, logout, boards }) => {
  if (!auth.loading && auth.authenticated) {
    return (
      <Fragment>
        <BSNavbar sticky='top' className='navbar-light' id='Navbar'>
          <div className='navContainer'>
            <SearchBar
              className='navSearch'
              label='Search my boards...'
              table={boards.boards.map((b) => ({ id: b._id, value: b.title }))}
              onSelectResult={(result) =>
                console.log(`Searched ${result.value}`)
              }
            />
            <Dropdown>
              <Dropdown.Toggle className='avatarBox'>
                <div className='avatar'>{auth.user.name[0]}</div>
                <div>{auth.user.name}</div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href='#/action-1'>
                  <Link className='nav-link' to='/login' onClick={logout}>
                    <i className='fas fa-sign-out'></i>
                    Logout
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </BSNavbar>
      </Fragment>
    );
  } else {
    return <Fragment></Fragment>;
  }
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ auth: state.auth, boards: state.boards });

export default connect(mapStateToProps, { logout })(Navbar);
