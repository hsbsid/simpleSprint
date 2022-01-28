import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//actions
import { registerDemo } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

//components
import AuthNav from './AuthNav';
import MyLinks from '../layout/MyLinks';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';

const DemoUser = ({ auth, registerDemo, setAlert }) => {
  const [boardId, setBoardId] = useState(null);

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
            <h2>Demo Account</h2>
            <span>
              View the app with a temporary demo account. Your account will be
              removed after 1 hour.
            </span>
            <Button
              onClick={async () => {
                setBoardId(await registerDemo());

                setAlert('Welcome to simpleSprint!', 'success');
              }}
            >
              Enter
            </Button>

            <span>
              Want to create an account instead?{' '}
              <Link to='/signup'>Sign up</Link>
            </span>

            <footer>
              <h4 className='logo'>simpleSprint</h4>

              <span>by Haseeb Siddiqui </span>
              <MyLinks />
            </footer>
          </Stack>
        </Col>
        <Col></Col>
      </Container>
    </Fragment>
  );
};

DemoUser.propTypes = {
  registerDemo: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { registerDemo, setAlert })(DemoUser);
