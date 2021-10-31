//check validation results, send error message or continue to function
const { body, check, validationResult } = require('express-validator');

module.exports = function (req, res, next) {
  const valErrors = validationResult(req);

  // if there are val errors, send them in the response, and return out of the function
  if (!valErrors.isEmpty()) {
    return res.status(400).json({ errors: valErrors.array() });
  } else {
    next();
  }
};
