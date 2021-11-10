import React, { Fragment } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/auth/Alert';

//redux
import store from './store';
import { Provider } from 'react-redux';

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Alert />
        <div className='container'>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Register} />
          </Switch>
        </div>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
