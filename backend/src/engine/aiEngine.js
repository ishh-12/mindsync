const applyAIDeception = (levelData, level) => {
  let modified = { ...levelData };

  // 🔥 Level 3+ → start lying
  if (level >= 3) {
    if (Math.random() > 0.5) {
      modified.clue = `Target = ${levelData.correctAnswer + 2}`; // fake clue
    }
  }

  // 🔥 Level 4+ → corrupt options
  if (level >= 4) {
    modified.options = modified.options.map(opt =>
      opt + (Math.random() > 0.5 ? 1 : -1)
    );
  }

  return modified;
};

module.exports = { applyAIDeception };