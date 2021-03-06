import {
  LOAD_ALL_BOARDS,
  BOARD_ERROR,
  LOAD_BOARD,
  BOARD_CREATED,
  BOARD_DELETED,
  BOARD_EDITED,
  CARD_CREATED,
  EDIT_CARD,
  CARD_DELETED,
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

export const createBoard = (boardData) => async (dispatch) => {
  try {
    const res = await api.post('/boards', boardData);

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

export const editBoard = (boardId, newBoardData) => async (dispatch) => {
  try {
    const res = await api.put(`/boards/${boardId}`, newBoardData);

    dispatch({ type: BOARD_EDITED, payload: res.data });

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

export const addCard = (cardData, boardId) => async (dispatch) => {
  try {
    //post request to /boards/:boardId, with body:cardData
    //this should create a new card under this board
    const res = await api.post(`/boards/${boardId}/cards`, cardData);

    dispatch({ type: CARD_CREATED, payload: res.data });
    dispatch(setAlert('Card Added', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    dispatch({
      type: BOARD_ERROR,
    });

    errors.forEach((e) => {
      dispatch(setAlert(e.msg, 'danger'));
    });
  }
};

export const deleteCard = (cardId) => async (dispatch) => {
  try {
    const res = await api.delete(`/boards/cards/${cardId}`);

    dispatch({ type: CARD_DELETED, payload: res.data });
  } catch (error) {
    const errors = error.response.data.errors;

    dispatch({
      type: BOARD_ERROR,
    });

    errors.forEach((e) => {
      dispatch(setAlert(e.msg, 'danger'));
    });
  }
};

export const editCard = (cardId, cardData) => async (dispatch) => {
  try {
    //make put request to change card data
    const res = await api.put(`/boards/cards/${cardId}`, cardData);

    dispatch({ type: EDIT_CARD, payload: res.data });

    return res.data;
  } catch (error) {
    const errors = error.response.data.errors;

    dispatch({
      type: BOARD_ERROR,
    });

    errors.forEach((e) => {
      dispatch(setAlert(e.msg, 'danger'));
    });
  }
};
