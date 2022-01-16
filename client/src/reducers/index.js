import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import boards from './boards';

import { AUTH_FAIL, AUTH_ERROR, LOGOUT } from '../actions/types';

const combinedReducers = combineReducers({ auth, alert, boards });

const rootReducer = (state, action) => {
  //on logout or auth fail, reset the store
  if (
    action.type == LOGOUT ||
    action.type == AUTH_ERROR ||
    action.type == AUTH_FAIL
  ) {
    //when undefined is passed to the combined reducer, the store is reset
    state = undefined;
  }

  return combinedReducers(state, action);
};

export default rootReducer;
