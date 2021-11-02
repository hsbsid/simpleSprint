import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = (props) => {
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
      console.log('passwords do not match');
    } else {
      // const newUser = { name, email, password: password1 };
      // try {
      //   const config = {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   };
      //   const body = JSON.stringify(newUser);
      //   const res = await axios.post('/api/users', body, config);
      //   console.log(res.data);
      // } catch (error) {
      //   console.log(error);
      // }

      console.log(formData);
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <h1>Log In</h1>
      <form onSubmit={(e) => onSubmit(e)}>
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
        <Button htmlType='submit'>Sign Up</Button>
      </form>
      <p>
        Don't have an account? <Link to='/signup'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {};

export default Login;
