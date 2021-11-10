import {
  LOGIN,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CHECK_AUTH,
} from '../actions/types';
import { setAlert } from './alert';
import axios from 'axios';

export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    console.log('REGISTER');
    const newUser = { name, email, password };
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify(newUser);
      const res = await axios.post('/api/users', body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      console.log(res.data);
    } catch (error) {
      const resErrors = error.response.data.errors;

      resErrors.forEach((e) => {
        setAlert(e.msg, 'error', 5000);
      });

      dispatch({
        type: REGISTER_FAIL,
      });
      console.log(error);
    }
  };
