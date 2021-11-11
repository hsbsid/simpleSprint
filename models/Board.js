const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      permission: {
        type: String,
        default: 'read',
      },
    },
  ],
  swimlanes: [
    {
      title: {
        type: String,
        required: true,
      },
      users: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
          },
        },
      ],
    },
  ],
  columns: [
    {
      name: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Board = mongoose.model('board', BoardSchema);
