//components
import React, { Fragment, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DemoUser from './components/auth/DemoUser';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import Loading from './components/layout/Loading';
import MyInfo from './components/layout/MyInfo';

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
  //set app DOM title
  useEffect(() => {
    store.dispatch(loadUser());
    document.title = 'simpleSprint';
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Alert />
          <PrivateRoute component={MyInfo} />
          <Switch>
            <Route exact path='/'>
              <Redirect to='/demoUser' />
            </Route>
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Register} />
            <Route exact path='/demoUser' component={DemoUser} />
            <PrivateRoute
              exact
              path={['/dashboard', '/dashboard/:id']}
              component={Dashboard}
            />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
