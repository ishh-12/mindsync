import React from "react";
import { useNavigate } from "react-router-dom";

function PlayButtons() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/create")}>
        Create Room
      </button>

      <button onClick={() => navigate("/join")}>
        Join Room
      </button>
    </div>
  );
}

export default PlayButtons;