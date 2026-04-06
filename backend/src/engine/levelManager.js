const { LEVELS } = require("../data/levels");

const generateLevelData = (levelNumber) => {
  const idx = (levelNumber || 1) - 1;
  const level = LEVELS[Math.min(idx, LEVELS.length - 1)];
  
  return {
    id: level.id,
    name: level.name,
    subtitle: level.subtitle,
    timeLimit: level.timeLimit,
    analystData: level.analyst,
    operatorData: level.operator,
    briefing: level.briefing
  };
};

module.exports = { generateLevelData };
