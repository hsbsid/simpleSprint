import React, { Fragment } from 'react';

const MyLinks = (props) => {
  return (
    <div className='MyLinks'>
      <h6>{props.children}</h6>
      <a href='http://haseebsiddiqui.ca'>
        <i class='fas fa-globe'></i>
      </a>
      <a href='https://linkedin.com/in/hsbsid'>
        <i className='fab fa-linkedin'></i>
      </a>
      <a href='https://github.com/hsbsid'>
        <i className='fab fa-github'></i>
      </a>
      <a href='mailto:me@haseebsiddiqui.ca'>
        <i className='fas fa-envelope'></i>
      </a>
    </div>
  );
};

export default MyLinks;
