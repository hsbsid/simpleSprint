import axios from 'axios';
import {
  AUTH_FAIL,
  AUTH_SUCCESS,
  SET_ALERT,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from '../actions/types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async (dispatch) => {
  //if there is a token in local storage, add axios header globally
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  //try to get the user
  try {
    const res = await axios.get('/api/auth');

    //no errors so dispatch the user loaded. res.data is the user id, pass to redux state
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_FAIL,
    });
  }
};

export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });

    //register the user
    try {
      const res = await axios.post('/api/users', body, config);

      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data,
      });

      //load the user into state based on token
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((e) => {
          dispatch(setAlert(e.msg, 'danger'));
        });
      }

      dispatch({
        type: AUTH_FAIL,
      });
    }
  };

export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = {
      email,
      password,
    };

    //try to log in using credentials
    try {
      const res = await axios.post('/api/auth', body, config);

      //dispatch success with auth token as payload
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data,
      });

      //load the user into state based on token
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      errors.forEach((e) => {
        dispatch(setAlert(e.msg, 'danger'));
      });

      dispatch({
        type: AUTH_ERROR,
      });
    }
  };

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
