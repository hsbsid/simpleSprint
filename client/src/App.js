import React, { Fragment } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <div className='container'>
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Register} />
        </Switch>
      </div>
    </Fragment>
  </Router>
);

export default App;
