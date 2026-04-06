import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLeaderboardAPI } from "../../services/api";

const rankColor = (rank) => {
  if (rank === 1) return "#ffd60a";
  if (rank === 2) return "#e8f4f8";
  if (rank === 3) return "#ff8c42";
  return "#4a6480";
};

export default function ResultContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score ?? 0;
  const trustScore = location.state?.trustScore ?? 0;
  const history = location.state?.history ?? [];
  const players = location.state?.players ?? [];
  const correct = location.state?.correct ?? history.filter((entry) => entry.correct).length;

  const [leaderboard, setLeaderboard] = useState(location.state?.leaderboard ?? []);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(!location.state?.leaderboard?.length);

  useEffect(() => {
    let active = true;

    if (leaderboard.length > 0) {
      setLoadingLeaderboard(false);
      return () => {
        active = false;
      };
    }

    const loadLeaderboard = async () => {
      const data = await getLeaderboardAPI();
      if (!active) return;
      setLeaderboard(data.success ? data.entries || [] : []);
      setLoadingLeaderboard(false);
    };

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, [leaderboard.length]);

  const outcome = useMemo(() => {
    if (correct >= 5) {
      return {
        status: "CITY SAVED",
        color: "#00ff88",
        summary: "Your team kept control through every escalation.",
      };
    }

    if (correct >= 3) {
      return {
        status: "CITY DAMAGED",
        color: "#ffd60a",
        summary: "You survived, but the bunker took some heavy hits.",
      };
    }

    return {
      status: "BUNKER FELL",
      color: "#ff3b5c",
      summary: "NEXUS broke the chain. Time to regroup and run it back.",
    };
  }, [correct]);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "#050911",
        color: "#e8f4f8",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            border: `1px solid ${outcome.color}33`,
            background: "#0d1421",
            position: "relative",
          }}
        >
          <div style={{ height: "3px", background: outcome.color }} />
          <div style={{ padding: "2rem" }}>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.68rem", color: "#4a6480", letterSpacing: "0.25em", marginBottom: "0.6rem" }}>
              FINAL DEBRIEF
            </div>
            <div style={{ fontFamily: "Barlow Condensed", fontSize: "2.4rem", fontWeight: 900, color: outcome.color, letterSpacing: "0.08em" }}>
              {outcome.status}
            </div>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.78rem", color: "#93a4b6", lineHeight: 1.8, marginTop: "0.8rem" }}>
              {outcome.summary}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.75rem", marginTop: "1.75rem" }}>
              {[
                { label: "FINAL SCORE", value: score, color: "#00e5ff" },
                { label: "LEVELS CLEARED", value: `${correct}/${history.length || 6}`, color: "#ffd60a" },
                { label: "TRUST SCORE", value: trustScore, color: "#ff8c42" },
              ].map((item) => (
                <div key={item.label} style={{ border: "1px solid #1a2d44", background: "#080c14", padding: "1rem" }}>
                  <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480", letterSpacing: "0.18em", marginBottom: "0.45rem" }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.9rem", fontWeight: 900, color: item.color }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {players.length > 0 && (
              <div style={{ marginTop: "1.5rem", border: "1px solid #1a2d44", background: "#080c14", padding: "1rem" }}>
                <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480", letterSpacing: "0.18em", marginBottom: "0.7rem" }}>
                  TEAM
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {players.map((player) => (
                    <div key={`${player.name}-${player.role}`} style={{ border: "1px solid #1a2d44", padding: "0.55rem 0.8rem", background: "#0d1421" }}>
                      <div style={{ fontFamily: "Barlow Condensed", fontSize: "1rem", fontWeight: 700, color: "#e8f4f8" }}>
                        {player.name}
                      </div>
                      <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: player.role === "operator" ? "#ff3b5c" : "#00e5ff" }}>
                        {player.role?.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.68rem", color: "#4a6480", letterSpacing: "0.22em", marginBottom: "0.8rem" }}>
                LEVEL BREAKDOWN
              </div>
              <div style={{ border: "1px solid #1a2d44", background: "#080c14" }}>
                <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 90px 90px", gap: "0.5rem", padding: "0.9rem 1rem", borderBottom: "1px solid #1a2d44" }}>
                  {["LEVEL", "STATUS", "POINTS", "TOTAL"].map((header) => (
                    <div key={header} style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480", letterSpacing: "0.18em" }}>
                      {header}
                    </div>
                  ))}
                </div>

                {history.length === 0 && (
                  <div style={{ padding: "1rem", fontFamily: "Share Tech Mono", fontSize: "0.75rem", color: "#4a6480" }}>
                    No round data was captured for this run.
                  </div>
                )}

                {history.map((entry) => (
                  <div
                    key={`level-${entry.level}-${entry.status}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "70px 1fr 90px 90px",
                      gap: "0.5rem",
                      padding: "0.9rem 1rem",
                      borderTop: "1px solid #1a2d441a",
                    }}
                  >
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.1rem", fontWeight: 800, color: "#e8f4f8" }}>
                      {entry.level}
                    </div>
                    <div>
                      <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.72rem", color: entry.correct ? "#00ff88" : "#ff8c42" }}>
                        {entry.status}
                      </div>
                      {(entry.selectedOption || entry.correctAnswer) && (
                        <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480", marginTop: "0.2rem" }}>
                          {entry.selectedOption ? `Picked: ${entry.selectedOption}` : "No answer"}
                          {entry.correctAnswer ? ` | Answer: ${entry.correctAnswer}` : ""}
                        </div>
                      )}
                    </div>
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.1rem", fontWeight: 800, color: entry.points >= 0 ? "#00e5ff" : "#ff3b5c" }}>
                      {entry.points >= 0 ? `+${entry.points}` : entry.points}
                    </div>
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.1rem", fontWeight: 800, color: "#e8f4f8" }}>
                      {entry.scoreAfter}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/create-room")}
                style={{
                  background: outcome.color,
                  color: "#080c14",
                  border: "none",
                  padding: "0.9rem 1.2rem",
                  fontFamily: "Barlow Condensed",
                  fontSize: "1rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                }}
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => navigate("/leaderboard")}
                style={{
                  background: "transparent",
                  color: "#e8f4f8",
                  border: "1px solid #1a2d44",
                  padding: "0.9rem 1.2rem",
                  fontFamily: "Share Tech Mono",
                  fontSize: "0.75rem",
                  letterSpacing: "0.14em",
                  cursor: "pointer",
                }}
              >
                OPEN FULL LEADERBOARD
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #1a2d44",
            background: "#0d1421",
            alignSelf: "start",
          }}
        >
          <div style={{ height: "3px", background: "#ffd60a" }} />
          <div style={{ padding: "1.5rem" }}>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.68rem", color: "#4a6480", letterSpacing: "0.22em", marginBottom: "0.7rem" }}>
              LEADERBOARD
            </div>
            <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.8rem", fontWeight: 900, color: "#e8f4f8", marginBottom: "1rem" }}>
              TOP TEAMS
            </div>

            {loadingLeaderboard && (
              <div style={{ border: "1px solid #1a2d44", background: "#080c14", padding: "1rem", fontFamily: "Share Tech Mono", fontSize: "0.72rem", color: "#4a6480" }}>
                LOADING LEADERBOARD...
              </div>
            )}

            {!loadingLeaderboard && leaderboard.length === 0 && (
              <div style={{ border: "1px solid #1a2d44", background: "#080c14", padding: "1rem", fontFamily: "Share Tech Mono", fontSize: "0.72rem", color: "#4a6480" }}>
                No leaderboard entries yet.
              </div>
            )}

            {!loadingLeaderboard && leaderboard.map((entry, index) => (
              <div
                key={entry._id || entry.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 1fr 70px",
                  gap: "0.6rem",
                  padding: "0.8rem 0",
                  borderTop: index === 0 ? "none" : "1px solid #1a2d441a",
                }}
              >
                <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.2rem", fontWeight: 900, color: rankColor(index + 1) }}>
                  {index + 1}
                </div>
                <div>
                  <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.75rem", color: "#e8f4f8", lineHeight: 1.5 }}>
                    {entry.name}
                  </div>
                  <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480" }}>
                    {entry.gamesPlayed} games
                  </div>
                </div>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.15rem", fontWeight: 800, color: "#00e5ff", textAlign: "right" }}>
                  {entry.bestScore}
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate("/")}
              style={{
                width: "100%",
                marginTop: "1.2rem",
                background: "transparent",
                color: "#4a6480",
                border: "1px solid #1a2d44",
                padding: "0.8rem 1rem",
                fontFamily: "Share Tech Mono",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                cursor: "pointer",
              }}
            >
              RETURN HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
