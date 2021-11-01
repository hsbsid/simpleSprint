const mongoose = require('mongoose');

const Profile = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  access: {
    type: String,
    required: true,
  },
});
