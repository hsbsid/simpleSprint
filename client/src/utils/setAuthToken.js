import api from './api';

//globally set auth token as a axios header
export default (token) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common('x-auth-token');
  }
};
