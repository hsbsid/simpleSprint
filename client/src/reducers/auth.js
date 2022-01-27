import {
  AUTH_FAIL,
  AUTH_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  CHECKING_AUTH,
  LOGOUT,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  authenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CHECKING_AUTH:
      return { ...state, loading: true };
    case AUTH_SUCCESS: //set the token in localstorage, update the state
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        token: payload.token,
        authenticated: true,
        loading: false,
      };
    case USER_LOADED: //add the user data to state when authenticated
      return {
        ...state,
        authenticated: true,
        loading: false,
        user: payload,
      };
    case LOGOUT:
    case AUTH_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        authenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
