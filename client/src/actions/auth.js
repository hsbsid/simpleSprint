import api from '../utils/api';
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

//function to get all users
export const getAllUsers = () => async (dispatch) => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((e) => {
        dispatch(setAlert(e.msg, 'danger'));
      });
    }

    return [];
  }
};

export const loadUser = () => async (dispatch) => {
  //if there is a token in local storage, add axios header globally
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  //try to get the user
  try {
    const res = await api.get('/auth');

    //no errors so dispatch the user loaded. res.data is the user id, pass to redux state
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_FAIL,
    });
  }
};

export const register = (registerFormData) => async (dispatch) => {
  //register the user
  try {
    const res = await api.post('/users', registerFormData);

    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data,
    });

    //load the user into state based on token
    dispatch(loadUser());

    return true;
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((e) => {
        dispatch(setAlert(e.msg, 'danger'));
      });
    }

    dispatch({
      type: AUTH_FAIL,
    });

    return false;
  }
};

export const login = (loginFormData) => async (dispatch) => {
  //try to log in using credentials
  try {
    const res = await api.post('/auth', loginFormData);

    //dispatch success with auth token as payload
    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data,
    });

    //load the user into state based on token
    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;

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
