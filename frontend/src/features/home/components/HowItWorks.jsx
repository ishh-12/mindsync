import React from "react";
import StepCard from "./shared/StepCard";

function HowItWorks() {
  return (
    <div>
      <StepCard step="1" title="Create Room" desc="Start a new game" />
      <StepCard step="2" title="Join Room" desc="Enter code" />
      <StepCard step="3" title="Play Game" desc="Survive chaos" />
    </div>
  );
}

export default HowItWorks;