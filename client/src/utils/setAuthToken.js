import axios from 'axios';

//globally set auth token as a axios header
export default (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common('x-auth-token');
  }
};
