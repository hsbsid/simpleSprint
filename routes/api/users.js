const express = require('express');
const { body, check, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const validationCheck = require('../../middleware/validationCheck');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Board = require('../../models/Board');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const removeBoard = require('./utils/removeBoard');

// @route  GET api/users
// @desc   get all users
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    //get all users
    let users = await User.find().select('-password');

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route  POST api/users
// @desc   Add new user to DB & get token
// @access Public
router.post(
  '/',
  [
    check('name', 'Invalid Name Provided').trim().not().isEmpty(),
    check('email', 'Invalid Email Provided')
      .trim()
      .isEmail()
      .normalizeEmail({ all_lowercase: true }),
    check('password', 'Invalid Password Provided').trim().isLength({ min: 6 }),
    validationCheck,
  ],
  async (req, res) => {
    // no errors, create the user
    const { name, email, password } = req.body;

    try {
      //check if user exists
      let user = await User.findOne({ email: email });

      //if user already exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already registered' }] });
      }

      //hash password
      user = new User({ name, email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //add to db
      await user.save();

      //give user an auth token
      //correct credentials, creat jwt token using email and jwtSecret
      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(
        payload,
        config.get('jwtSecret') || process.env.jwtSecret,
        { expiresIn: '1 hour' },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }
);

// @route  POST api/users/demo
// @desc   Add new demo user to DB
// @access Public
router.post('/demo', async (req, res) => {
  //gen a random ID of up to 5 digits
  let id;
  let existingUser;

  do {
    id = Math.floor(Math.random() * 99999).toString();
    existingUser = await User.findOne({ name: `Demo${id}` }); //find demo user with the current id
  } while (existingUser); //keep generating while the id is taken

  const ranPassword = Math.floor(
    Math.random * (9999999999 - 1000000000) + 1000000000
  ).toString(); //random 10 digit password
  const { name, email, password, demo } = {
    name: `Demo${id}`,
    email: `Demo${id}@simplesprint.ca`,
    password: ranPassword,
    demo: true,
  };

  try {
    //check if user exists
    let user = await User.findOne({ email: email });

    //if user already exists
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Email already registered' }] });
    }

    user = new User({ name, email, password, demo });

    //hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //add to db
    await user.save();

    //give user an auth token
    //correct credentials, creat jwt token using email and jwtSecret
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(
      payload,
      config.get('jwtSecret') || process.env.jwtSecret,
      { expiresIn: '1 hour' },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/users/demo
// @desc   Delete expired demo users
// @access Public
router.delete('/demo', async (req, res) => {
  try {
    const expiryTime = new Date(Date.now() - 60 * 60 * 1000);
    //get all demo users older than 1 hour
    const expiredDemoUsers = await User.find({
      demo: true,
      dateJoined: { $lte: expiryTime },
    });

    if (expiredDemoUsers && expiredDemoUsers.length >= 1) {
      //if there are expired users
      //delete any boards owned by the user
      expiredDemoUsers.forEach(async (user) => {
        const boards = await Board.find({
          'users.user': user.id,
        });

        boards.forEach(
          async (board) =>
            await removeBoard(res, board._id, new ObjectId(user.id))
        );
      });

      //delete all the demo users
      await User.deleteMany({
        demo: true,
        dateJoined: { $lte: expiryTime },
      });
    }

    //return the deleted user ids
    res.json(expiredDemoUsers.map((user) => user.id));
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
