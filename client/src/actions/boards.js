import { LOAD_ALL_BOARDS, BOARD_ERROR, LOAD_BOARD } from '../actions/types';
import axios from 'axios';
import { setAlert } from './alert';

export const getAllBoards = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/boards/');
    dispatch({
      type: LOAD_ALL_BOARDS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    errors.forEach((e) => {
      dispatch(setAlert(e.msg, 'danger'));
    });

    dispatch({
      type: BOARD_ERROR,
    });
  }
};

export const getBoard = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/boards/${id}`);

    dispatch({
      type: LOAD_BOARD,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err);
    errors.forEach((e) => {
      dispatch(setAlert(e.msg, 'danger'));
    });

    dispatch({
      type: BOARD_ERROR,
    });
  }
};

export const createBoard =
  ({ title, users, columns }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ title, users, columns });

    try {
      const res = await axios.post('/api/boards', body, config);

      dispatch(setAlert('Board Created', 'success'));

      return res.data._id;
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(err);
      errors.forEach((e) => {
        dispatch(setAlert(e.msg, 'danger'));
      });

      dispatch({
        type: BOARD_ERROR,
      });
    }
  };
