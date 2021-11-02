import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, Router } from 'react-router-dom';
import { Menu } from 'antd';

const Navbar = () => {
  return (
    <Fragment>
      <Menu direction='horizontal'>
        <Menu.Item>
          <Link to='/login'>Log In</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to='/signup'>Sign Up</Link>
        </Menu.Item>
      </Menu>
    </Fragment>
  );
};

export default Navbar;
