import React from "react";
import TimerBar from "./components/TimerBar";

const feedbackTone = (tone) => {
  if (tone === "success") {
    return {
      color: "#00ff88",
      border: "#00ff88",
      bg: "rgba(0,255,136,0.06)",
    };
  }

  return {
    color: "#ff3b5c",
    border: "#ff3b5c",
    bg: "rgba(255,59,92,0.06)",
  };
};

const stripDirectSignalAnswer = (note) => {
  if (!note) return "";
  return note
    .replace(/\b(STATIC|SIGNAL|BREACH)\s*=\s*[^.]+\.?/gi, "")
    .replace(/\bSend\s+(STATIC|SIGNAL|BREACH)\.?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const SIGNAL_RULES = [
  { label: "STATIC", meaning: "Routine or expected habit", color: "#00ff88" },
  { label: "SIGNAL", meaning: "Check, confirm, or read again", color: "#ffd60a" },
  { label: "BREACH", meaning: "Urgent, high-risk, or panic state", color: "#ff3b5c" },
];

const SyncScreen = ({ roomCode, players, role, syncing }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      background: "#080c14",
      color: "#e8f4f8",
      fontFamily: "Share Tech Mono",
    }}
  >
    <div style={{ fontSize: "0.65rem", color: "#4a6480", letterSpacing: "0.3em", marginBottom: "1rem" }}>
      ROOM: {roomCode}
    </div>
    <div style={{ fontSize: "1rem", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
      {syncing ? "SYNCING LEVEL..." : "WAITING FOR PLAYERS..."}
    </div>
    <div style={{ fontSize: "0.72rem", color: "#4a6480", marginBottom: "1.5rem" }}>
      {role
        ? `ROLE: ${role === "operator" ? "OPERATOR" : role === "analyst" ? "ANALYST" : role.toUpperCase()}`
        : "ASSIGNING ROLE"}
    </div>
    <div style={{ fontSize: "0.7rem", color: "#4a6480", letterSpacing: "0.1em" }}>
      PLAYERS: {players.length}/2
    </div>
    {players.map((player) => (
      <div
        key={`${player.name}-${player.role}`}
        style={{
          fontSize: "0.7rem",
          color: player.role === "operator" ? "#ff3b5c" : "#00e5ff",
          marginTop: "0.6rem",
        }}
      >
        {player.name} - {player.role?.toUpperCase()}
      </div>
    ))}
  </div>
);

export default function GameContainer({
  roomCode,
  players,
  role,
  waiting,
  syncing,
  levelData,
  timer,
  score,
  trustScore,
  signal,
  feedback,
  onSelect,
  onSendSignal,
}) {
  if (waiting || syncing || !levelData) {
    return (
      <SyncScreen
        roomCode={roomCode}
        players={players}
        role={role}
        syncing={syncing}
      />
    );
  }

  const displayRole = levelData.role || role;
  const levelNumber = levelData.level || levelData.id || 1;
  const totalLevels = levelData.totalLevels || 6;
  const tone = feedbackTone(feedback?.tone);

  return (
    <div
      className="mobile-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        background: "#080c14",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,59,92,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,92,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        className="mobile-card mobile-game-card"
        style={{
          border: `1px solid ${levelData.corrupt ? "#ff3b5c" : "#1a2d44"}`,
          padding: "2rem",
          background: "#0d1421",
          maxWidth: "460px",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: levelData.corrupt ? "#ff3b5c" : levelData.silenced ? "#4a6480" : "#00e5ff",
          }}
        />

        <div className="mobile-stack" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.65rem", color: "#4a6480", letterSpacing: "0.2em" }}>
              LEVEL {levelNumber}/{totalLevels}
            </div>
            <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.5rem", fontWeight: 900, color: "#e8f4f8" }}>
              {levelData.name}
            </div>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.68rem", color: "#4a6480" }}>
              ROUND IN PROGRESS
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.65rem", color: "#4a6480", letterSpacing: "0.2em" }}>
              TOTAL SCORE
            </div>
            <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.7rem", fontWeight: 900, color: "#00e5ff" }}>
              {score}
            </div>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480" }}>
              TRUST {trustScore}
            </div>
          </div>
        </div>

        {levelData.corrupt && (
          <div
            style={{
              background: "rgba(255,59,92,0.08)",
              border: "1px solid #ff3b5c44",
              padding: "0.65rem 1rem",
              marginBottom: "1rem",
              fontFamily: "Share Tech Mono",
              fontSize: "0.7rem",
              color: "#ff3b5c",
              textAlign: "center",
            }}
          >
            WARNING: NEXUS MAY BE FEEDING FALSE SIGNALS
          </div>
        )}

        {levelData.silenced && (
          <div
            style={{
              background: "rgba(74,100,128,0.1)",
              border: "1px solid #4a648044",
              padding: "0.65rem 1rem",
              marginBottom: "1rem",
              fontFamily: "Share Tech Mono",
              fontSize: "0.7rem",
              color: "#8aa0b8",
              textAlign: "center",
            }}
          >
            COMMS ARE JAMMED FOR THIS ROUND
          </div>
        )}


        <TimerBar key={`${levelNumber}-${timer}`} duration={timer} />

        {feedback && (
          <div
            className="mobile-card--tight"
            style={{
              textAlign: "center",
              padding: "0.9rem",
              fontFamily: "Barlow Condensed",
              fontSize: "1.25rem",
              fontWeight: 900,
              color: tone.color,
              letterSpacing: "0.14em",
              marginBottom: "1rem",
              border: `1px solid ${tone.border}`,
              background: tone.bg,
            }}
          >
            <div>{feedback.label}</div>
            <div style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>
              ROUND SCORE {feedback.points >= 0 ? `+${feedback.points}` : feedback.points}
            </div>
            {feedback.detail && (
              <div
                style={{
                  fontFamily: "Share Tech Mono",
                  fontSize: "0.68rem",
                  lineHeight: 1.6,
                  letterSpacing: "0.04em",
                  marginTop: "0.55rem",
                }}
              >
                {feedback.detail}
              </div>
            )}
          </div>
        )}

        {displayRole === "operator" && (
          <div>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.7rem", color: "#ff3b5c", letterSpacing: "0.3em", marginBottom: "1.1rem" }}>
              ROLE: OPERATOR
            </div>

            <div style={{ border: "1px solid #1a2d44", background: "#080c14", padding: "0.9rem 1rem", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.63rem", color: "#4a6480", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
                ROAST
              </div>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.72rem", color: "#c9d1d9", lineHeight: 1.7 }}>
                {stripDirectSignalAnswer(levelData.operatorNote) || "Roast says: slow / check / panic."}
              </div>
            </div>

            <div style={{ border: "1px solid #1a2d44", background: "#080c14", padding: "0.9rem 1rem", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.63rem", color: "#4a6480", letterSpacing: "0.2em", marginBottom: "0.6rem" }}>
                SIGNAL RULES
              </div>
              <div style={{ display: "grid", gap: "0.55rem" }}>
                {SIGNAL_RULES.map((rule) => (
                  <div key={rule.label} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline", fontFamily: "Share Tech Mono", fontSize: "0.68rem", lineHeight: 1.5 }}>
                    <span style={{ color: rule.color, letterSpacing: "0.14em" }}>{rule.label}</span>
                    <span style={{ color: "#9db0c4", textAlign: "right" }}>{rule.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {!levelData.silenced ? (
              <div>
                <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.7rem", color: "#4a6480", letterSpacing: "0.3em", marginBottom: "0.75rem" }}>
                  SEND YOUR SIGNAL
                </div>
                <div className="mobile-stack" style={{ display: "flex", gap: "0.5rem" }}>
                  {[
                    { label: "STATIC", color: "#00ff88" },
                    { label: "SIGNAL", color: "#ffd60a" },
                    { label: "BREACH", color: "#ff3b5c" },
                  ].map((entry) => (
                    <button
                      key={entry.label}
                      onClick={() => onSendSignal(entry.label)}
                      style={{
                        flex: 1,
                        padding: "0.75rem 0.25rem",
                        minHeight: "44px",
                        background: signal === entry.label ? entry.color : "transparent",
                        color: signal === entry.label ? "#080c14" : entry.color,
                        border: `1px solid ${entry.color}44`,
                        fontFamily: "Share Tech Mono",
                        fontSize: "clamp(0.65rem, 2vw, 0.7rem)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 0,
                        transition: "all 0.2s",
                      }}
                      onTouchStart={e => { e.currentTarget.style.borderColor = entry.color; }}
                      onTouchEnd={e => { e.currentTarget.style.borderColor = entry.color + "44"; }}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem", fontFamily: "Share Tech Mono", fontSize: "0.75rem", color: "#4a6480", border: "1px solid #1a2d44" }}>
                SIGNALS TURNED OFF THIS ROUND
              </div>
            )}
          </div>
        )}

        {displayRole === "analyst" && (
          <div>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.7rem", color: "#00e5ff", letterSpacing: "0.3em", marginBottom: "1.1rem" }}>
              ROLE: ANALYST
            </div>

            <div style={{ border: "1px solid #1a2d44", padding: "1rem", background: "#080c14", marginBottom: "1rem", textAlign: "center" }}>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.65rem", color: "#4a6480", marginBottom: "0.5rem" }}>
                OPERATOR SIGNAL
              </div>
              <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.6rem", fontWeight: 900, color: signal ? "#ffd60a" : "#1a2d44" }}>
                {signal || "WAITING..."}
              </div>
            </div>

            <div style={{ border: "1px solid #1a2d44", background: "#080c14", padding: "0.9rem 1rem", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.63rem", color: "#4a6480", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
                SIGNAL
              </div>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.72rem", color: "#9db0c4", lineHeight: 1.7 }}>
                Use the incoming signal with the scene to make your pick.
              </div>
            </div>

            <div style={{ border: "1px solid #1a2d44", background: "#080c14", padding: "0.9rem 1rem", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.63rem", color: "#4a6480", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
                SCENE
              </div>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.72rem", color: "#c9d1d9", lineHeight: 1.7 }}>
                {levelData.clue}
              </div>
            </div>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.7rem", color: "#4a6480", letterSpacing: "0.3em", marginBottom: "0.75rem" }}>
              CHOOSE THE BEST ANSWER
            </div>
            {levelData.options?.map((option) => (
              <button
                key={option}
                className="mobile-option-button"
                onClick={() => onSelect(option)}
                disabled={Boolean(feedback)}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  background: "transparent",
                  color: "#e8f4f8",
                  border: "1px solid #1a2d44",
                  fontFamily: "Barlow Condensed",
                  fontWeight: 700,
                  fontSize: "clamp(0.95rem, 4vw, 1.15rem)",
                  cursor: feedback ? "not-allowed" : "pointer",
                  marginBottom: "0.5rem",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
