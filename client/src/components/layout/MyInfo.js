import React from 'react';
import Toast from 'react-bootstrap/Toast';
import MyLinks from '../layout/MyLinks';

const MyInfo = () => {
  return (
    <Toast position='bottom-end'>
      <Toast.Header closeButton={false}>
        <h5>simpleSprint</h5>
        <span>by Haseeb Siddiqui</span>
      </Toast.Header>
      <Toast.Body>
        <MyLinks />
      </Toast.Body>
    </Toast>
  );
};

export default MyInfo;
