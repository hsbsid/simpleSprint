import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Input, Button, Alert as AntdAlert } from 'antd';
import axios from 'axios';
import { setAlert } from '../../actions/alert';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
  console.log('ALERTS:');
  console.log(alerts);

  return (
    alerts != null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <Fragment>
        <AntdAlert type={alert.alertType} message={alert.msg} />
      </Fragment>
    ))
  );
};
Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
