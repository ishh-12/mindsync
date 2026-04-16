import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLeaderboardAPI } from "../../services/api";

const rankColor = (rank) => {
  if (rank === 1) return "#ffd60a";
  if (rank === 2) return "#e8f4f8";
  if (rank === 3) return "#ff8c42";
  return "#4a6480";
};

const personalityMeta = {
  skeptical: {
    label: "Chaos Detective",
    summary: "You don't trust easy stories. Good. Most disasters begin with 'bro trust me.'",
    color: "#00e5ff",
  },
  composed: {
    label: "Pressure Reader",
    summary: "You stayed calmer than the average panic merchant and it showed.",
    color: "#00ff88",
  },
  patient: {
    label: "Slow Burner",
    summary: "You resisted emotional bait better than most. Rare skill.",
    color: "#8bd3ff",
  },
  responsible: {
    label: "Last-Minute Saver",
    summary: "When chaos appeared, you still leaned toward action instead of denial.",
    color: "#ffd60a",
  },
  loyal: {
    label: "Certified Loyalist",
    summary: "In betrayal rounds, your instincts leaned heart-first instead of panic-first.",
    color: "#ff8c42",
  },
  delusional: {
    label: "Hope Merchant",
    summary: "You understand the art of lying to yourself with full confidence.",
    color: "#ff3b5c",
  },
  reliable: {
    label: "Team Carrier",
    summary: "You spotted the one-person-carries-everything pattern immediately.",
    color: "#00ff88",
  },
  distracted: {
    label: "Doomscroll Oracle",
    summary: "You clearly know how distraction wins in real life. Maybe too well.",
    color: "#ffd60a",
  },
  dramatic: {
    label: "Drama Translator",
    summary: "You can smell overacting from a mile away.",
    color: "#ff8c42",
  },
  predictive: {
    label: "Friendship Analyst",
    summary: "You read petty human behavior like patch notes.",
    color: "#00e5ff",
  },
  realist: {
    label: "Reality Checker",
    summary: "You chose what actually happens, not what people wish happened.",
    color: "#e8f4f8",
  },
  drained: {
    label: "Energy Collapse Expert",
    summary: "You understand the exact moment group energy dies.",
    color: "#8aa0b8",
  },
  overthinker: {
    label: "Mind Spiral Reader",
    summary: "You know emotional chaos intimately. Probably from experience.",
    color: "#ff3b5c",
  },
  "time-blind": {
    label: "Time Fraud Analyst",
    summary: "You know who says '5 minutes' and means an entire era.",
    color: "#ffd60a",
  },
  chaotic: {
    label: "Chaos Prophet",
    summary: "You predicted escalation because deep down you expected nonsense.",
    color: "#ff8c42",
  },
  unreliable: {
    label: "Trust Issues Specialist",
    summary: "You know promises are cheap and recovery missions are real.",
    color: "#00e5ff",
  },
};

const buildRoleRoast = (player, score, trustScore, correct) => {
  const role = player.role;

  if (role === "operator") {
    if (trustScore >= 3) {
      return "As Operator, your cues were eerily accurate. The roast was almost deserved.";
    }

    if (score < 0) {
      return "As Operator, you sent chaos straight to the wrong inbox. Brutal misfire.";
    }

    return "Your signals were half genius, half chaos. Operator energy with a twist.";
  }

  if (role === "analyst") {
    if (correct >= 5) {
      return "As Analyst, you turned chaos into a victory lap. Snacks after this.";
    }

    if (score < 0) {
      return "You felt the vibe, but your guess still got roasted. Still fun though.";
    }

    return "You had flashes of friendship intuition, plus a few questionable reads.";
  }

  return "You survived the chaos somehow. That already deserves respect.";
};

const specialRoundRoasts = {
  "LAB PARTNER TRAUMA": "You really played a blank-PDF trust fall and called it teamwork.",
  "ATTENDANCE SCAM": "Attendance fraud appeared and your survival instincts had to file an appeal.",
  "PLACEMENT FEAR": "One fake 'easy question' and the whole room started sweating internally.",
  "CRUSH MESSAGE": "A single 'hmmm' caused more damage than the final round.",
  "EXAM NIGHT": "Academic collapse plus false hope is one of your team's core languages.",
  "ULTIMATE BETRAYAL": "This round tested friendship, morality, and how dramatic your lobby could become.",
  "ALARM LIES": "You stared directly at self-sabotage and recognized it instantly. Respect.",
  "GROUP PROJECT": "The one-person-carries-everything truth hit a little too close to home.",
  "GYM PLAN": "Tomorrow was never real and your team knew it.",
  "EXAM STRATEGY": "You understood that productivity talk and YouTube addiction are best friends.",
  "ATTENDANCE RULE": "The attendance delusion round exposed exactly how dangerous hope can be.",
  "LAB INTERNALS": "Confidently-wrong energy is apparently a language your team speaks fluently.",
  "FOOD BETRAYAL": "You knew 'I don't want anything' was a trap. That's lived experience.",
  "TRIP PLANS": "Group-chat confidence versus real-world attendance remains undefeated.",
  "MOVIE NIGHT": "The choice was never the movie. The choice was how fast energy dies.",
  "LAST SEEN": "Emotional overanalysis remains one of the strongest forces in the universe.",
  "GOOD NIGHT TEXT": "Delayed replies clearly triggered the collective mind spiral.",
  "MOTIVATION LOOP": "You recognized fake productivity with terrifying accuracy.",
  "SCREEN TIME": "Nobody on this team believes in 'just 5 minutes' anymore.",
  "SERIAL LATE FRIEND": "This team has suffered too many fake ETAs to be fooled now.",
  "ROOMMATE AFTER EXAM": "You decoded post-exam drama like veteran hostel survivors.",
  "REEL SENDER FRIEND": "You knew one reel was never one reel. That's cultural knowledge.",
  "HOSTEL BORROWER": "The charger recovery mission clearly unlocked old trauma.",
};

export default function ResultContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score ?? 0;
  const trustScore = location.state?.trustScore ?? 0;
  const history = useMemo(() => location.state?.history ?? [], [location.state]);
  const players = useMemo(() => location.state?.players ?? [], [location.state]);
  const correct = location.state?.correct ?? history.filter((entry) => entry.correct).length;

  const [leaderboard, setLeaderboard] = useState(location.state?.leaderboard ?? []);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(!location.state?.leaderboard?.length);
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 960 : false
  );

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

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => {
      setIsCompact(window.innerWidth < 960);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const outcome = useMemo(() => {
    if (correct >= 5) {
      return {
        status: "CLUE MASTERED",
        color: "#00ff88",
        summary: "You nailed every wild read and kept the roast train rolling.",
      };
    }

    if (correct >= 3) {
      return {
        status: "NEAR MISS",
        color: "#ffd60a",
        summary: "You stayed on track, but the chaos still hit the party once.",
      };
    }

    return {
      status: "TOTAL ROAST",
      color: "#ff3b5c",
      summary: "The squad got roasted hard. Time to come back with better vibes.",
    };
  }, [correct]);

  const personalityOutcome = useMemo(() => {
    const counts = history.reduce((accumulator, entry) => {
      if (!entry.personalityTag) return accumulator;
      accumulator[entry.personalityTag] = (accumulator[entry.personalityTag] || 0) + 1;
      return accumulator;
    }, {});

    const dominantTag = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return personalityMeta[dominantTag] || null;
  }, [history]);

  const roleRoasts = useMemo(
    () =>
      players.map((player) => ({
        ...player,
        roast: buildRoleRoast(player, score, trustScore, correct),
      })),
    [players, score, trustScore, correct]
  );

  const specialRoast = useMemo(() => {
    const uniqueNames = [...new Set(history.map((entry) => entry.levelName).filter(Boolean))];
    const matching = uniqueNames
      .map((name) => specialRoundRoasts[name])
      .filter(Boolean);

    if (matching.length === 0) return null;

    if (matching.length === 1) {
      return matching[0];
    }

    return `${matching[0]} ${matching[matching.length - 1]}`;
  }, [history]);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: isCompact ? "1rem" : "2rem",
        background: "#050911",
        color: "#e8f4f8",
      }}
    >
      <div
        className="mobile-result-grid"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isCompact ? "1fr" : "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
          gap: "1.5rem",
        }}
      >
        <div
          className="mobile-result-panel"
          style={{
            border: `1px solid ${outcome.color}33`,
            background: "#0d1421",
            position: "relative",
          }}
        >
          <div style={{ height: "3px", background: outcome.color }} />
          <div style={{ padding: isCompact ? "1.15rem" : "2rem" }}>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.68rem", color: "#4a6480", letterSpacing: "0.25em", marginBottom: "0.6rem" }}>
              FINAL DEBRIEF
            </div>
            <div style={{ fontFamily: "Barlow Condensed", fontSize: "2.4rem", fontWeight: 900, color: outcome.color, letterSpacing: "0.08em" }}>
              {outcome.status}
            </div>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.78rem", color: "#93a4b6", lineHeight: 1.8, marginTop: "0.8rem" }}>
              {outcome.summary}
            </div>

            {personalityOutcome && (
              <div style={{ marginTop: "1.2rem", border: `1px solid ${personalityOutcome.color}33`, background: "#080c14", padding: "1rem" }}>
                <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480", letterSpacing: "0.18em", marginBottom: "0.45rem" }}>
                  CHAOS PROFILE
                </div>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.45rem", fontWeight: 900, color: personalityOutcome.color }}>
                  {personalityOutcome.label}
                </div>
                <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.72rem", color: "#9db0c4", lineHeight: 1.7, marginTop: "0.45rem" }}>
                  {personalityOutcome.summary}
                </div>
              </div>
            )}

            {specialRoast && (
              <div style={{ marginTop: "1rem", border: "1px solid #ff8c4233", background: "#080c14", padding: "1rem" }}>
                <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480", letterSpacing: "0.18em", marginBottom: "0.45rem" }}>
                  FEST VERDICT
                </div>
                <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.74rem", color: "#ffcf99", lineHeight: 1.7 }}>
                  {specialRoast}
                </div>
              </div>
            )}

            <div className="mobile-result-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "1.75rem" }}>
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
                <div className="mobile-result-team" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
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

            {roleRoasts.length > 0 && (
              <div style={{ marginTop: "1.5rem", border: "1px solid #1a2d44", background: "#080c14", padding: "1rem" }}>
                <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480", letterSpacing: "0.18em", marginBottom: "0.8rem" }}>
                  ROLE ROASTS
                </div>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {roleRoasts.map((player) => (
                    <div key={`${player.name}-${player.role}-roast`} style={{ border: "1px solid #1a2d44", background: "#0d1421", padding: "0.9rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: isCompact ? "flex-start" : "center", flexDirection: isCompact ? "column" : "row" }}>
                        <div style={{ fontFamily: "Barlow Condensed", fontSize: "1.05rem", fontWeight: 800, color: "#e8f4f8" }}>
                          {player.name}
                        </div>
                        <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: player.role === "operator" ? "#ff3b5c" : "#00e5ff" }}>
                          {player.role?.toUpperCase()}
                        </div>
                      </div>
                      <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.7rem", color: "#9db0c4", lineHeight: 1.7, marginTop: "0.5rem" }}>
                        {player.roast}
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
                <div className="mobile-result-history-header" style={{ display: "grid", gridTemplateColumns: isCompact ? "52px 1fr 62px 62px" : "70px 1fr 90px 90px", gap: "0.5rem", padding: "0.9rem 1rem", borderBottom: "1px solid #1a2d44" }}>
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
                    className="mobile-result-history-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: isCompact ? "52px 1fr 62px 62px" : "70px 1fr 90px 90px",
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
                      {entry.levelName && (
                        <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#8aa0b8", marginTop: "0.2rem" }}>
                          {entry.levelName}
                        </div>
                      )}
                      {entry.selectedOption && (
                        <div style={{ fontFamily: "Share Tech Mono", fontSize: "0.62rem", color: "#4a6480", marginTop: "0.2rem" }}>
                          Picked: {entry.selectedOption}
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

            <div className="mobile-result-actions" style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
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
          className="mobile-result-sidebar"
          style={{
            border: "1px solid #1a2d44",
            background: "#0d1421",
            alignSelf: "start",
          }}
        >
          <div style={{ height: "3px", background: "#ffd60a" }} />
          <div style={{ padding: isCompact ? "1.15rem" : "1.5rem" }}>
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
