import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//actions
import { login } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

//components
import AuthNav from './AuthNav';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';

const Login = ({ auth, login, setAlert }) => {
  //create state to monitor form field values
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  //create state to monitor validation
  const [validation, setValidation] = useState({
    valid: true,
    emailValid: true,
    passwordValid: true,
    validationMessage: '',
  });

  const { valid, emailValid, passwordValid, validationMessage } = validation;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || email === '') {
      return setAlert('Please enter an email', 'danger');
    }

    if (!password || password === '') {
      return setAlert('Please enter a password', 'danger');
    }

    await login({ email, password });
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
                <FloatingLabel label='Email'>
                  <Form.Control
                    placeholder='Email'
                    onChange={(e) => onChange(e)}
                    name='email'
                    value={email}
                    isInvalid={!emailValid}
                  />
                </FloatingLabel>
                <FloatingLabel label='Password'>
                  <Form.Control
                    placeholder='Password'
                    type='password'
                    onChange={(e) => onChange(e)}
                    name='password'
                    value={password}
                    isInvalid={!passwordValid}
                  />
                </FloatingLabel>
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
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { login, setAlert })(Login);
