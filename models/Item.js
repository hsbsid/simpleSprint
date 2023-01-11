const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'list',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: null,
  },
});

module.exports = Item = mongoose.model('item', CardSchema);
