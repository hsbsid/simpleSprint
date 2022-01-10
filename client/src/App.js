//components
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

//Redux
import store from './store';
import { Provider } from 'react-redux';
import { loadUser } from './actions/auth';

//stylesheets
import './App.scss';
import 'antd/dist/antd.css';

//utils
import setAuthToken from './utils/setAuthToken';

//check for auth token and add to global headers
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //load user action, only on component did mount
  useEffect(() => {
    store.dispatch(loadUser());
  }, {});

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Alert />
          <Switch>
            <Route exact path='/'>
              <Redirect to='/login' />
            </Route>
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Register} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
