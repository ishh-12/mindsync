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
  trustScore: {
     type: Number, default: 0
     },   // trust in system
lastChoices: {
   type: [Number], default: [] 
  }, // recent answers
fastPlayer: { 
  type: Boolean, default: false 
}, // speed detection
});

module.exports = mongoose.model("Room", roomSchema);
