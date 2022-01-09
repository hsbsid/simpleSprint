import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

//components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import AuthNav from './AuthNav';

const Register = ({ setAlert, register, auth }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
  });

  const { name, email, password1, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password1 != password2) {
      setAlert('Passwords do not match', 'error');
    } else {
      //register action, if register is successful, show an alert
      register({ name, email, password: password1 });
    }
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

            <h2>Sign Up</h2>

            <form onSubmit={(e) => onSubmit(e)}>
              <Stack gap={1}>
                <Form.Control
                  name='name'
                  placeholder='Name'
                  value={name}
                  onChange={onChange}
                />
                <Form.Control
                  name='email'
                  placeholder='Email'
                  value={email}
                  onChange={onChange}
                />
                <Form.Control
                  name='password1'
                  placeholder='Password'
                  type='password'
                  value={password1}
                  onChange={onChange}
                />
                <Form.Control
                  name='password2'
                  placeholder='Confirm Password'
                  type='password'
                  value={password2}
                  onChange={onChange}
                />
              </Stack>
              <Button type='submit'>Sign Up</Button>
            </form>

            <span>
              Already have an account? <Link to='/login'>Log in</Link>
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

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, { setAlert, register })(Register);
