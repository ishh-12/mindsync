const levels = require("../data/levels");

// 🎯 VALIDATE ANSWER + SCORING
const handleAnswer = (room, selectedOption) => {
  const levelData = levels[room.level - 1];

  const isCorrect = selectedOption === levelData.answer;

  let points = isCorrect ? 10 : -5;

  // 🎁 bonus levels
  if (isCorrect && room.level === 5) points += 15;
  if (isCorrect && room.level === 6) points += 20;

  room.score = (room.score || 0) + points;

  return { isCorrect, points };
};

// 🧠 TRUST SCORE
const updateTrustScore = (room, isCorrect) => {
  room.trustScore = room.trustScore || 0;

  if (isCorrect) room.trustScore += 1;
  else room.trustScore -= 1;
};

// 🎮 LEVEL PROGRESSION
const nextLevel = (room) => {
  room.level += 1;

  if (room.level > 6) {
    room.status = "finished";
    return "game_over";
  }

  return "next_level";
};

module.exports = {
  handleAnswer,
  updateTrustScore,
  nextLevel,
};