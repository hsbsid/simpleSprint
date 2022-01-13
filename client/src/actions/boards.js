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
