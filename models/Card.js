const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'board',
    required: true,
  },
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
  swimlane: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'board.swimlanes',
    required: true,
  },
  column: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Card = mongoose.model('card', CardSchema);
