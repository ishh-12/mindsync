const generateLevelData = (level) => {
  let target = Math.floor(Math.random() * 20) + 1;

  let options = [];

  // generate random options
  for (let i = 0; i < 4; i++) {
    options.push(Math.floor(Math.random() * 20) + 1);
  }

  // ensure correct answer exists
  options[Math.floor(Math.random() * 4)] = target;

  return {
    clue: `Target = ${target}`,
    options,
    correctAnswer: target,
    level,
  };
};

module.exports = { generateLevelData };