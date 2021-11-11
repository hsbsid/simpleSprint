import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Input, Button } from 'antd';
import axios from 'axios';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import { connect } from 'react-redux';
import Alert from './Alert';

const Register = ({ setAlert, register }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
  });

  const { name, email, password1, password2 } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password1 != password2) {
      setAlert('passwords do not match', 'error', 5000);
    } else {
      await register({ name, email, password: password1 });
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <h1>Sign Up</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <Input
          name='name'
          placeholder='Name'
          value={name}
          onChange={onChange}
        />
        <Input
          name='email'
          placeholder='Email'
          value={email}
          onChange={onChange}
        />
        <Input
          name='password1'
          placeholder='Password'
          type='password'
          value={password1}
          onChange={onChange}
        />
        <Input
          name='password2'
          placeholder='Confirm Password'
          type='password'
          value={password2}
          onChange={onChange}
        />
        <Button htmlType='submit'>Sign Up</Button>
        <p>
          Already have an account? <Link to='/login'>Log In</Link>
        </p>
      </form>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, register })(Register);
