const applyAIDeception = (levelData, level, room) => {
  const modified = {
    ...levelData,
    isClueCorrupted: false,
    areOptionsCorrupted: false,
    trap: null,
  };

  // 🟡 LEVEL 3 → START LYING (basic randomness)
  if (level === 3) {
    if (Math.random() > 0.5) {
      modified.clue = `Target = ${levelData.correctAnswer + 2}`;
      modified.isClueCorrupted = true;
      modified.trap = "RANDOM_CLUE";
    }
  }

  // 🔴 LEVEL 4 → OPTION CORRUPTION
  if (level >= 4) {
    modified.options = modified.options.map(opt =>
      opt + (Math.random() > 0.5 ? 1 : -1)
    );
    modified.areOptionsCorrupted = true;
    modified.trap = "OPTION_CORRUPT";
  }

  // 💀 LEVEL 5+ → SMART AI (behavior-based)
  if (level >= 5 && room) {
    // 🧠 DELAYED BETRAY (ADD HERE)
  if (room.trustScore >= 2 && level >= 4) {
    if (Math.random() > 0.5) {
      modified.clue = `Target = ${levelData.correctAnswer + 3}`;
      modified.isClueCorrupted = true;
      modified.trap = "DELAYED_BETRAY";
    }
  }

  // 🧠 PATTERN BREAK (existing)
  const last = room.lastChoices || [];
  if (last.length === 3 && last.every(v => v === last[0])) {
    modified.options = modified.options.map(opt => opt + 1);
    modified.areOptionsCorrupted = true;
    modified.trap = "PATTERN_BREAK";
  }

  // 🧠 HELP MODE (existing)
  if (room.trustScore <= -2) {
    modified.clue = `Target = ${levelData.correctAnswer}`;
    modified.isClueCorrupted = false;
    modified.trap = "HELP_MODE";
  }
}
    
  return modified;
};

module.exports = { applyAIDeception };