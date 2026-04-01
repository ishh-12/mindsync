import { createContext, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [score, setScore] = useState(0);

  return (
    <GameContext.Provider value={{ role, setRole, score, setScore }}>
      {children}
    </GameContext.Provider>
  );
};