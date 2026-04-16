import React, { useMemo, useState } from "react";

function BriefCard({ card, active, color }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: active ? 1 : 0,
        transform: active ? "translateX(0)" : "translateX(32px)",
        transition: "all 0.35s ease",
        pointerEvents: active ? "auto" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "#161b22",
          border: `2px solid ${color}`,
          padding: "clamp(1rem, 4vw, 2rem)",
          boxShadow: `0 0 32px ${color}22`,
        }}
      >
        <div
          style={{
            fontFamily: "Share Tech Mono",
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            color: "#0d1117",
            background: color,
            display: "inline-block",
            padding: "0.3rem 0.8rem",
            marginBottom: "1rem",
          }}
        >
          {card.tag}
        </div>
        <div style={{ fontSize: "clamp(1.5rem, 5vw, 2.2rem)", marginBottom: "0.7rem" }}>{card.icon}</div>
        <div
          style={{
            fontFamily: "Barlow Condensed",
            fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
            fontWeight: 900,
            color: "#f0f6fc",
            marginBottom: "0.8rem",
            letterSpacing: "0.05em",
          }}
        >
          {card.title}
        </div>
        <div
          style={{
            fontFamily: "Share Tech Mono",
            fontSize: "clamp(0.7rem, 2.5vw, 0.8rem)",
            color: "#c9d1d9",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
          }}
        >
          {card.text}
        </div>
      </div>
    </div>
  );
}

export default function LevelBriefing({ levelNumber = 1, levelData, onComplete }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [exiting, setExiting] = useState(false);

  const briefing = useMemo(() => {
    const accent = levelData?.silenced ? "#8aa0b8" : levelData?.corrupt ? "#ff3b5c" : "#00e5ff";
    const cards = [
      {
        tag: "SITUATION",
        icon: "🧨",
        title: levelData?.name || `LEVEL ${levelNumber}`,
        text: levelData?.clue || "Chaos has arrived. Stay sharp.",
      },
      {
        tag: "OPERATOR",
        icon: "🎛️",
        title: "Send the signal",
        text: levelData?.silenced
          ? "No signal is possible. Stay quiet and let the round play out."
          : levelData?.corrupt
            ? "NEXUS may lie this round. Send a signal that says how trustworthy the answer feels."
            : "Read the roast line and send a signal that guides the Analyst without spelling it out.",
      },
      {
        tag: "ANALYST",
        icon: "🧠",
        title: "Pick the answer",
        text: levelData?.silenced
          ? "No signal. Use the clue and your instincts."
          : "Use the scene and incoming signal together, then lock your best pick.",
      },
    ];

    return {
      accent,
      cards,
      heading: levelData?.stageName || `LEVEL ${levelNumber}`,
      subtitle: "ROUND BRIEFING",
    };
  }, [levelData, levelNumber]);

  const handleComplete = () => {
    setExiting(true);
    setTimeout(() => onComplete?.(), 350);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(8,12,20,0.97)",
        display: "flex",
        flexDirection: "column",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.35s ease",
      }}
    >
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: `1px solid ${briefing.accent}55`,
          background: "#0d1117",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Orbitron",
              fontSize: "0.82rem",
              color: briefing.accent,
              letterSpacing: "0.18em",
            }}
          >
            {briefing.heading}
          </div>
          <div
            style={{
              fontFamily: "Share Tech Mono",
              fontSize: "0.72rem",
              color: "#c9d1d9",
              letterSpacing: "0.16em",
              marginTop: "0.25rem",
            }}
          >
            {briefing.subtitle}
          </div>
        </div>
        <button
          onClick={handleComplete}
          style={{
            background: "#161b22",
            color: "#f0f6fc",
            border: "1px solid #4a5563",
            padding: "0.55rem 1rem",
            minHeight: "44px",
            minWidth: "88px",
            fontFamily: "Share Tech Mono",
            fontSize: "0.76rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          SKIP
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "0.45rem", padding: "0.9rem" }}>
        {briefing.cards.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentCard(index)}
            style={{
              width: index === currentCard ? "26px" : "10px",
              height: "10px",
              background: index <= currentCard ? briefing.accent : "#30363d",
              borderRadius: "999px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {briefing.cards.map((card, index) => (
          <BriefCard
            key={`${card.tag}-${index}`}
            card={card}
            active={index === currentCard}
            color={briefing.accent}
          />
        ))}
      </div>

      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: `1px solid ${briefing.accent}55`,
          background: "#0d1117",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setCurrentCard((value) => Math.max(0, value - 1))}
          disabled={currentCard === 0}
          style={{
            background: currentCard === 0 ? "#10151d" : "#1f2937",
            color: currentCard === 0 ? "#5a6472" : "#f0f6fc",
            border: currentCard === 0 ? "1px solid #2b3441" : `1px solid ${briefing.accent}88`,
            padding: "0.6rem 1rem",
            minHeight: "44px",
            minWidth: "92px",
            fontFamily: "Share Tech Mono",
            fontSize: "0.76rem",
            cursor: currentCard === 0 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          PREV
        </button>

        <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.68rem", color: "#8b949e" }}>
          {currentCard + 1} / {briefing.cards.length}
        </div>

        <button
          onClick={() => {
            if (currentCard < briefing.cards.length - 1) {
              setCurrentCard((value) => value + 1);
            } else {
              handleComplete();
            }
          }}
          style={{
            background: briefing.accent,
            color: "#0d1117",
            border: `1px solid ${briefing.accent}`,
            padding: "0.6rem 1.1rem",
            minHeight: "44px",
            minWidth: "92px",
            fontFamily: "Orbitron",
            fontSize: "0.76rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {currentCard === briefing.cards.length - 1 ? "START CHAOS" : "NEXT"}
        </button>
      </div>
    </div>
  );
}
