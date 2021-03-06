import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getAllUsers } from '../../actions/auth';
import { createBoard } from '../../actions/boards';
import { setAlert } from '../../actions/alert';

import SearchBar from '../inputs/SearchBar';
import Loading from '../layout/Loading';

import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Badge from 'react-bootstrap/Badge';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const CreateBoard = (props) => {
  const { getAllUsers, createBoard, setAlert } = props;
  const { user } = props.auth;

  //create a state for the form data
  // title: title of board
  // collaborators: list of collaborators
  // columns: list of columns
  // newColumn: used to track new column input value
  // users: holds list of all users in database
  const [formData, setFormData] = useState({
    title: '',
    collaborators: [],
    columns: ['Backlog', 'In Progress', 'Completed'],
    newColumn: '',
    users: { userList: [], loading: true },
    redirect: '',
  });

  const { title, collaborators, columns, users, newColumn, redirect } =
    formData;

  //on render get list of all users and add to component state
  useEffect(async () => {
    setFormData({
      ...formData,
      users: { userList: await getAllUsers(), loading: false },
    });
  }, []);

  const titleOnChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };

  //when a collaborator is added from the search bar
  const collaboratorsOnSelect = (resultUser) => {
    if (!resultUser) {
      return setAlert('Invalid User', 'danger');
    }

    //boolean which is true when the selected user is not already in the collaborator list
    const isNewId =
      collaborators.filter((user) => user.id.localeCompare(resultUser.id) === 0)
        .length === 0;

    if (isNewId) {
      setFormData({
        ...formData,
        collaborators: [...collaborators, resultUser],
      });
    } else {
      setAlert('That person is already added to this board', 'danger');
    }
  };

  //remove a selected collaborator from the list
  const removeCollaborator = (e) => {
    e.preventDefault();

    setFormData({
      ...formData,
      collaborators: collaborators.filter((c) => c.id != e.target.id),
    });
  };

  //track the new column input changes
  const addColumnOnChange = (e) => {
    setFormData({
      ...formData,
      newColumn: e.target.value,
    });
  };

  //add selected column to the list
  const addColumn = (e) => {
    e.preventDefault();

    if (!newColumn || newColumn.trim() == '') {
      return setAlert('Invalid Column Name', 'danger');
    }

    //ensure the column name is not already in the list, same method as collaboratorsOnSelect()
    const isNewCol =
      columns.filter((c) => c.localeCompare(newColumn.trim()) === 0).length ===
      0;

    if (isNewCol) {
      setFormData({
        ...formData,
        columns: [...columns, newColumn.trim()],
        newColumn: '',
      });
    } else {
      setAlert('That column is already added to this board', 'danger');
    }
  };

  //remove a selected column from the list
  const removeColumn = (e) => {
    e.preventDefault();

    setFormData({
      ...formData,
      columns: columns.filter((c) => c != e.target.value),
    });
  };

  //on submission of the completed form
  const onSubmit = async (e) => {
    e.preventDefault();

    //form validation

    //check for empty fields:
    if (!title || title === '') {
      return setAlert('Please enter a title', 'danger');
    }

    if (columns.length <= 0) {
      return setAlert('Must include atleast one column', 'danger', 6000);
    }

    //add permission to all the users
    const users = collaborators.map((c) => ({
      user: c.id,
      permission: 'Collaborator',
    }));

    const newId = await createBoard({ title: title.trim(), users, columns });

    setFormData({ ...formData, redirect: `/dashboard/${newId}` });
  };

  if (redirect.localeCompare('') !== 0) {
    return <Redirect to={redirect} />;
  }

  //output the component when the users are done loading
  return !users.loading ? (
    <Fragment>
      <Form id='CreateBoard' onSubmit={(e) => onSubmit(e)}>
        <h3>Create a new board</h3>
        <Stack gap={2}>
          <FloatingLabel label='Board Title'>
            <Form.Control
              name='title'
              value={title}
              type='text'
              placeholder='e.g. Sprint 24'
              onChange={(e) => titleOnChange(e)}
            ></Form.Control>
          </FloatingLabel>
          <ListGroup>
            <ListGroup.Item>
              Board Collaborators
              <p>Add teammates to your board</p>
            </ListGroup.Item>
            <ListGroup.Item id={user._id}>
              Me <Badge>Owner</Badge>
            </ListGroup.Item>
            {collaborators.map((user) => (
              <ListGroup.Item
                action
                onClick={(e) => {
                  removeCollaborator(e);
                }}
                id={user.id}
              >
                {user.value}
                <span>
                  Remove from list <i class='fas fa-times'></i>
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <SearchBar
            label='Search for more people...'
            table={users.userList
              .filter((u) => u._id !== user._id)
              .map((u) => ({
                id: u._id,
                value: `${u.name} (${u.email})`,
              }))}
            onSelectResult={collaboratorsOnSelect}
          />

          <ListGroup>
            <ListGroup.Item>
              Columns
              <p>Add columns to your board</p>
            </ListGroup.Item>
            {columns.map((col) => (
              <ListGroup.Item
                action
                onClick={(e) => {
                  removeColumn(e);
                }}
                value={col}
              >
                {col}
                <span>
                  Remove from list <i class='fas fa-times'></i>
                </span>
              </ListGroup.Item>
            ))}
            <InputGroup className='mb-3'>
              <FloatingLabel label='Add a column'>
                <Form.Control
                  placeholder='Add Column'
                  value={newColumn}
                  onChange={(e) => addColumnOnChange(e)}
                />
              </FloatingLabel>
              <Button
                className='addButton'
                variant='outline-secondary'
                onClick={(e) => addColumn(e)}
              >
                <i class='fas fa-plus'></i>
              </Button>
            </InputGroup>
          </ListGroup>
          <Button type='submit'>Create Board</Button>
        </Stack>
      </Form>
    </Fragment>
  ) : (
    <Loading></Loading>
  );
};

CreateBoard.propTypes = {
  user: PropTypes.object.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  createBoard: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getAllUsers, createBoard, setAlert })(
  CreateBoard
);
