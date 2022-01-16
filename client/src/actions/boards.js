import {
  LOAD_ALL_BOARDS,
  BOARD_ERROR,
  LOAD_BOARD,
  BOARD_CREATED,
  BOARD_DELETED,
} from '../actions/types';

import api from '../utils/api';
import { setAlert } from './alert';

export const getAllBoards = () => async (dispatch) => {
  try {
    const res = await api.get('/boards');
    dispatch({
      type: LOAD_ALL_BOARDS,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

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
    const res = await api.get(`/boards/${id}`);

    dispatch({
      type: LOAD_BOARD,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    errors.forEach((e) => {
      dispatch(setAlert(e.msg, 'danger'));
    });

    dispatch({
      type: BOARD_ERROR,
    });
  }
};

export const createBoard = (boardFormData) => async (dispatch) => {
  try {
    const res = await api.post('/boards', boardFormData);

    dispatch({ type: BOARD_CREATED, payload: res.data });

    dispatch(setAlert('Board Created', 'success'));

    return res.data._id;
  } catch (error) {
    const errors = error.response.data.errors;

    errors.forEach((e) => {
      dispatch(setAlert(e.msg, 'danger'));
    });

    dispatch({
      type: BOARD_ERROR,
    });
  }
};

export const deleteBoard = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/boards/${id}`);

    dispatch({ type: BOARD_DELETED, payload: id });
  } catch (error) {
    const errors = error.response.data.errors;

    errors.forEach((e) => {
      dispatch(setAlert(e.msg, 'danger'));
    });

    dispatch({
      type: BOARD_ERROR,
    });
  }
};
