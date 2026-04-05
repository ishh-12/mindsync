const LeaderboardEntry = require("../models/LeaderboardEntry");

const getLeaderboard = async (_req, res) => {
  try {
    const entries = await LeaderboardEntry.find()
      .sort({ bestScore: -1, totalScore: -1, gamesPlayed: -1, name: 1 })
      .limit(20)
      .lean();

    res.json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
    });
  }
};

module.exports = { getLeaderboard };
