const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateJoined: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  demo: {
    type: Boolean,
    default: false,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
