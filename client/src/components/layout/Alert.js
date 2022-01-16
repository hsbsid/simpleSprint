import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

//components
import BSAlert from 'react-bootstrap/Alert';

function Alert({ alerts }) {
  return (
    <Fragment>
      {alerts.map((a) => (
        <BSAlert className='appAlert' variant={a.alertType}>
          {a.msg}
        </BSAlert>
      ))}
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, null)(Alert);
