import React, { Fragment, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const TextEdit = ({
  onBlur,
  editValue,
  onSubmit,
  onChange,
  onExit,
  placeholder = editValue,
  customClasses = '',
}) => {
  const [value, setValue] = useState(editValue);

  return (
    <Fragment>
      <Form
        className={`text-edit ${customClasses}`}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e, value);
        }}
        onBlur={() => onBlur()}
      >
        <Form.Control
          autoFocus
          type='text'
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e, e.target.value);
          }}
          style={{ width: `${value.length + 0.5}ch` }}
        />
        <Button
          type='submit'
          onMouseDown={(e) => {
            e.preventDefault();
            onSubmit(e, value);
          }}
        >
          <i className='fas fa-check'></i>
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onExit();
          }}
        >
          <i className='fas fa-times'></i>
        </Button>
      </Form>
    </Fragment>
  );
};

export default TextEdit;
