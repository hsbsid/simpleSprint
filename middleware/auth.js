const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  //get token from header
  const token = req.header('x-auth-token');

  //check for a token
  if (!token) {
    return res.status(401).json({ errors: [{ msg: 'Access denied' }] });
  }

  //if token is provided, check it.
  try {
    jwt.verify(token, config.get('jwtSecret'), async function (error, decoded) {
      if (error) {
        return res.status(401).json({ errors: [{ msg: 'Access denied' }] });
      }

      const id = decoded.user.id;
      let user = await User.findById(id);

      //if user is found, add to request, else throw error
      if (user) {
        req.user = decoded.user;
        next();
      } else {
        return res.status(401).json({ errors: [{ msg: 'Access denied' }] });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};
