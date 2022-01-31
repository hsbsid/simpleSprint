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
        default: 'Read',
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
      type: String,
      required: true,
    },
  ],
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = Board = mongoose.model('board', BoardSchema);
