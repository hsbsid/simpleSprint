import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//actions
import { login } from '../../actions/auth';

//components
import AuthNav from './AuthNav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

const Login = ({ auth, login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  //if the user is logged in, redirect them
  if (auth.authenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <Container className='authContainer'>
        <Col></Col>
        <Col xs={5}>
          <Stack gap={3} className='authForm'>
            <AuthNav />
            <h2>Login</h2>

            <form onSubmit={(e) => onSubmit(e)}>
              <Stack gap={1}>
                <Form.Control
                  placeholder='Email'
                  onChange={(e) => onChange(e)}
                  name='email'
                  value={email}
                />
                <Form.Control
                  placeholder='Password'
                  type='password'
                  onChange={(e) => onChange(e)}
                  name='password'
                  value={password}
                />
              </Stack>
              <Button type='submit'>Login</Button>
            </form>

            <span>
              New to simpleSprint? <Link to='/signup'>Sign up</Link>
            </span>

            <footer>
              <h4 className='logo'>simpleSprint</h4>
              <a href='https://github.com/hsbsid'>
                <span>by Haseeb Siddiqui </span>
                <i class='fab fa-github'></i>
              </a>
            </footer>
          </Stack>
        </Col>
        <Col></Col>
      </Container>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { login })(Login);
