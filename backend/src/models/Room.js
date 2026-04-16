const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  players: [{
    socketId: String,
    name: String,
    role: String,
    isHost: Boolean
  }],
  status: { type: String, default: "waiting" },
  level: { type: Number, default: 1 },
  score: { type: Number, default: 0 },
  trustScore: { type: Number, default: 0 },
  assignedQuestionIds: { type: [String], default: [] },
  betrayalLevel: { type: Number, default: null },
  lastChoices: { type: [String], default: [] },
  currentAnswer: { type: String, default: null },
  currentTargetName: { type: String, default: null },
  currentHint: { type: String, default: "" },
  hintSent: { type: Boolean, default: false },
  roundActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

roomSchema.virtual("currentLevel")
  .get(function getCurrentLevel() {
    return this.level;
  })
  .set(function setCurrentLevel(value) {
    this.level = value;
  });

module.exports = mongoose.model("Room", roomSchema);
