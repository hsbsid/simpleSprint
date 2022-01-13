import React, { Fragment } from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
  return (
    <Fragment>
      <div id='Loading'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    </Fragment>
  );
};

export default Loading;
