const { Schema, model } = require('mongoose');

const user = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  topScores: {
    type: Number,
    required: true,
    default: 0,
  },
  topLevel: {
    type: Number,
    required: true,
    default: 1,
  },
});

module.exports = model('user', user);
