import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const SearchBar = (props) => {
  const [query, setQuery] = useState({ value: '', suggestions: [] });

  const { value, suggestions } = query;

  const onChange = (e) => {
    //filter the table for values which include the query
    const newQuery = e.target.value;
    const newSuggestions =
      newQuery.trim().localeCompare('') === 0
        ? []
        : props.table.filter((item) =>
            item.value.toUpperCase().includes(newQuery.toUpperCase())
          );

    setQuery({
      ...query,
      value: newQuery,
      suggestions: newSuggestions,
    });
  };

  const onSelectResult = (resultValue) => {
    setQuery({ ...query, value: '', suggestions: [] });
    props.onSelectResult(resultValue);
  };

  return (
    <Fragment>
      <div className='searchbar'>
        <FloatingLabel label={props.label}>
          <Form.Control
            name={props.name}
            value={value}
            type='text'
            onChange={(e) => onChange(e)}
          ></Form.Control>
        </FloatingLabel>
        <div class='searchSuggestions'>
          <ul className={suggestions.length <= 0 && 'empty'}>
            {suggestions.map((item) => (
              <li onClick={(e) => onSelectResult(item)}>{item.value}</li>
            ))}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default SearchBar;
