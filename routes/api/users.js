const express = require('express');
const { body, check, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const validationCheck = require('../../middleware/validationCheck');

const User = require('../../models/User');

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
        config.get('jwtSecret'),
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

module.exports = router;
