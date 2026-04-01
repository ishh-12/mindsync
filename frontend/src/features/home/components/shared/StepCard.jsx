import React from "react";

function StepCard({ step, title, desc }) {
  return (
    <div>
      <h3>{step}</h3>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

export default StepCard;