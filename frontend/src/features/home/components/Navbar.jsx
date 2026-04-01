import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav>
      <h2 onClick={() => navigate("/")}>ATRAIC</h2>

      <div>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/leaderboard")}>
          Leaderboard
        </button>
      </div>
    </nav>
  );
}

export default Navbar;