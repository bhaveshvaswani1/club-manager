const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema(
  {
    pollName: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    option1: {
      type: String,
      required: true,
    },
    option2: {
      type: String,
      required: true,
    },
    option3: {
      type: String,
    },
    option4: {
      type: String,
    },
    vote1: {
      type: Number,
    },
    vote2: {
      type: Number,
    },
    vote3: {
      type: Number,
    },
    vote4: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: {
      type: String,
    },
    votedUser: [],
  },
  {
    timestamps: true,
  }
);

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
