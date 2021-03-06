import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loading from '../layout/Loading';

function PrivateRoute({
  component: Component,
  auth: { authenticated, loading },
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          <Loading />
        ) : !authenticated ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps)(PrivateRoute);
