const express = require('express');
const { body, check, validationResult } = require('express-validator');
const router = express.Router();
const validationCheck = require('../../middleware/validationCheck');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const bcrypt = require('bcrypt');

// @route  GET api/auth
// @desc   check authorization
// @access Private
router.get('/', auth, async (req, res) => {
  res.json(req.user);
});

// @route  POST api/auth
// @desc   Login endpoint: check credentials and get token
// @access Public
router.post(
  '/',
  [
    check('email', 'Valid email required')
      .trim()
      .isEmail()
      .normalizeEmail({ all_lowercase: true }),
    check('password', 'Valid password required').trim().notEmpty(),
    validationCheck,
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      //find the user
      let user = await User.findOne({ email: email });

      //if the user doesn't exist
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      //user does exist
      //check password
      const passwordMatch = await bcrypt.compare(password, user.password);

      //if not a match, return error
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

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

module.exports = router;
