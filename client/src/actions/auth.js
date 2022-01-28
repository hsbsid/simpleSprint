import api from '../utils/api';
import {
  AUTH_FAIL,
  AUTH_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CHECKING_AUTH,
} from '../actions/types';
import { setAlert } from './alert';
// import { createBoard, addCard, getAllBoards } from './boards';
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

    dispatch({
      type: AUTH_FAIL,
    });

    if (errors) {
      errors.forEach((e) => {
        dispatch(setAlert(e.msg, 'danger'));
      });
    }

    return false;
  }
};

export const registerDemo = () => async (dispatch) => {
  try {
    dispatch({ type: CHECKING_AUTH });

    const res = await api.post('/users/demo');

    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);

    //add a demo board to the user
    const demoBoardId = (
      await api.post('/boards', {
        title: 'Demo Board',
        columns: ['Backlog', 'In Progress', 'Done', 'Blocked'],
        users: [],
      })
    ).data._id;

    const exampleBoardId = (
      await api.post('/boards', {
        title: 'Example Board 2',
        columns: ['To Do', 'Focus', 'Completed'],
        users: [],
      })
    ).data._id;

    //add some cards to the boards
    const demoCards = [
      { title: 'To do', column: 'Backlog' },
      { title: 'Task 1', column: 'Backlog' },
      { title: 'Task 2', column: 'Backlog' },
      { title: 'Doing', column: 'In Progress' },
      { title: 'Goal B', column: 'In Progress' },
      { title: 'Done', column: 'Done' },
      { title: 'Goal A', column: 'Done' },
      { title: 'Goal C', column: 'Blocked' },
    ];

    const exampleCards = [
      {
        title: 'Read 7 Habits of Highly Effective People by Stephen Covey',
        column: 'To Do',
      },
      { title: 'Write Blog Post', column: 'To Do' },
      { title: 'Read Range by David Epstein', column: 'Focus' },
      { title: 'Edit newsletter', column: 'To Do' },
      { title: "Post today's video", column: 'Completed' },
      { title: "Send this week's newletter issue", column: 'Completed' },
    ];

    demoCards.forEach(async (card) => {
      await api.post(`/boards/${demoBoardId}/cards`, card);
    });

    exampleCards.forEach(async (card) => {
      await api.post(`/boards/${exampleBoardId}/cards`, card);
    });

    //add the user to auth
    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data,
    });

    //load the user into state based on token
    dispatch(loadUser());

    return res.data._id;
  } catch (error) {
    const errors = error.response.data.errors;

    dispatch({
      type: AUTH_FAIL,
    });

    if (errors) {
      errors.forEach((e) => {
        dispatch(setAlert(e.msg, 'danger'));
      });
    }

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

    dispatch({
      type: AUTH_ERROR,
    });

    errors.forEach((e) => {
      dispatch(setAlert(e.msg, 'danger'));
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
