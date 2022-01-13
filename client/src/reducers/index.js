import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import boards from './boards';

export default combineReducers({ auth, alert, boards });
