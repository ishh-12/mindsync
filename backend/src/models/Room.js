const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
  },
  players: [
    {
      socketId: String,
      name: String,
      role: String,
    },
  ],
  status: {
    type: String,
    default: "waiting",
  },
  level: {
    type: Number,
    default: 1,
  },
  score: {
    type: Number,
    default: 0,
  },
  currentAnswer: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
