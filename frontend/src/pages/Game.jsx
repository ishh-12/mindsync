import React, { useState } from 'react';
import GameContainer from '../features/game/GameContainer';
import LevelBriefing from '../features/home/components/LevelBriefing';

export default function Game() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showBriefing, setShowBriefing] = useState(true);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);

  const handleBriefingComplete = () => {
    setShowBriefing(false);
  };

  const handleLevelComplete = (nextLevel) => {
    if (nextLevel <= 6) {
      setCurrentLevel(nextLevel);
      setShowBriefing(true);
    }
  };

  return (
    <>
      {showBriefing ? (
        <LevelBriefing
          levelNumber={currentLevel}
          onComplete={handleBriefingComplete}
        />
      ) : (
        <GameContainer
          levelNumber={currentLevel}
          onLevelComplete={handleLevelComplete}
          score={score}
          setScore={setScore}
          correct={correct}
          setCorrect={setCorrect}
        />
      )}
    </>
  );
}