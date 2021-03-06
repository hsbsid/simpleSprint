import { SET_ALERT, REMOVE_ALERT } from './types';
import { v4 } from 'uuid';

export const setAlert =
  (msg, alertType, time = 1200) =>
  (dispatch) => {
    const id = v4();

    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), time);
  };
