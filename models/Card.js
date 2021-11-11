const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
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
  columns: {
    type: [String],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Card = mongoose.model('card', CardSchema);
