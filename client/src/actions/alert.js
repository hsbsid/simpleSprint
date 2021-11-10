import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

export const setAlert = (msg, alertType, duration) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  //remove the same alert based on duration
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), duration);
};
