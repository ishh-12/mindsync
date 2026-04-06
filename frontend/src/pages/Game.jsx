import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../services/socket";
import GameContainer from "../features/game/GameContainer";
import LevelBriefing from "../features/home/components/LevelBriefing";

const buildHistoryEntry = (payload, type) => ({
  level: payload.completedLevel ?? payload.level ?? 1,
  points: payload.points ?? 0,
  scoreAfter: payload.score ?? 0,
  correct: Boolean(payload.correct),
  status:
    type === "time_up"
      ? "Time Up"
      : payload.correct
        ? "Survived"
        : "Compromised",
  selectedOption: payload.selectedOption ?? null,
  correctAnswer: payload.correctAnswer ?? null,
});

export default function Game() {
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [players, setPlayers] = useState([]);
  const [role, setRole] = useState("");
  const [waiting, setWaiting] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [pendingLevel, setPendingLevel] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [trustScore, setTrustScore] = useState(0);
  const [signal, setSignal] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const appendHistory = (entry) => {
    const nextHistory = [...historyRef.current, entry];
    historyRef.current = nextHistory;
    setHistory(nextHistory);
  };

  useEffect(() => {
    if (!roomCode) return;

    const playerName = localStorage.getItem("playerName") || "Player";
    socket.emit("join_room", { roomCode, name: playerName });

    const onRoleAssigned = ({ role: assignedRole }) => {
      setRole(assignedRole || "");
    };

    const onRoomUpdate = (data) => {
      setPlayers(data.players || []);
      if ((data.players || []).length >= 2) {
        setWaiting(false);
      }
    };

    const onGameStarted = (data) => {
      setPlayers(data.players || []);
      setWaiting(false);
      setSyncing(false);
      setShowBriefing(false);
      setPendingLevel(null);
      setActiveLevel(null);
      setTimer(0);
      setScore(0);
      setTrustScore(0);
      setSignal("");
      setFeedback(null);
      setHistory([]);
    };

    const onLevelIntro = (data) => {
      setRole(data.role || "");
      setPendingLevel(data);
      setActiveLevel(null);
      setTimer(data.duration || 0);
      setSignal("");
      setFeedback(null);
      setWaiting(false);
      setSyncing(false);
      setShowBriefing(true);
    };

    const onLevelSync = () => {
      setSyncing(true);
    };

    const onLevelData = (data) => {
      setRole(data.role || "");
      setActiveLevel(data);
      setTimer(data.duration || 0);
      setSignal("");
      setFeedback(null);
      setSyncing(false);
    };

    const onTimerStart = ({ time }) => {
      setTimer(time || 0);
    };

    const onReceiveSignal = (nextSignal) => {
      setSignal(nextSignal || "");
    };

    const onResult = (payload) => {
      setScore(payload.score ?? 0);
      setTrustScore(payload.trustScore ?? 0);
      setSignal("");
      setFeedback({
        label: payload.correct ? "MISSION SUCCESS" : "MISSION FAILED",
        points: payload.points ?? 0,
        tone: payload.correct ? "success" : "danger",
      });
      appendHistory(buildHistoryEntry(payload, "result"));
    };

    const onTimeUp = (payload) => {
      setScore(payload.score ?? 0);
      setTrustScore(payload.trustScore ?? 0);
      setSignal("");
      setFeedback({
        label: payload.message || "TIME UP",
        points: payload.points ?? -5,
        tone: "danger",
      });
      appendHistory(buildHistoryEntry(payload, "time_up"));
    };

    const onGameOver = (payload) => {
      const finalHistory = historyRef.current;
      navigate("/result", {
        state: {
          score: payload.score ?? 0,
          trustScore: payload.trustScore ?? 0,
          players: payload.players || [],
          leaderboard: payload.leaderboard || [],
          history: finalHistory,
          correct: finalHistory.filter((entry) => entry.correct).length,
        },
      });
    };

    const onError = (message) => {
      alert(message);
    };

    socket.on("role_assigned", onRoleAssigned);
    socket.on("room_update", onRoomUpdate);
    socket.on("game_started", onGameStarted);
    socket.on("level_intro", onLevelIntro);
    socket.on("level_sync", onLevelSync);
    socket.on("level_data", onLevelData);
    socket.on("timer_start", onTimerStart);
    socket.on("receive_signal", onReceiveSignal);
    socket.on("result", onResult);
    socket.on("time_up", onTimeUp);
    socket.on("game_over", onGameOver);
    socket.on("error", onError);

    return () => {
      socket.off("role_assigned", onRoleAssigned);
      socket.off("room_update", onRoomUpdate);
      socket.off("game_started", onGameStarted);
      socket.off("level_intro", onLevelIntro);
      socket.off("level_sync", onLevelSync);
      socket.off("level_data", onLevelData);
      socket.off("timer_start", onTimerStart);
      socket.off("receive_signal", onReceiveSignal);
      socket.off("result", onResult);
      socket.off("time_up", onTimeUp);
      socket.off("game_over", onGameOver);
      socket.off("error", onError);
    };
  }, [navigate, roomCode]);

  const handleBriefingComplete = () => {
    if (!roomCode || !pendingLevel) return;
    setShowBriefing(false);
    setSyncing(true);
    socket.emit("ready_for_level", {
      roomCode,
      level: pendingLevel.level,
    });
  };

  const handleSelect = (option) => {
    if (!roomCode || !activeLevel || feedback) return;
    socket.emit("select_option", { roomCode, option });
  };

  const handleSendSignal = (nextSignal) => {
    if (!roomCode || !activeLevel || activeLevel.silenced) return;
    setSignal(nextSignal);
    socket.emit("send_signal", { roomCode, signal: nextSignal });
  };

  if (showBriefing && pendingLevel) {
    return (
      <LevelBriefing
        levelNumber={pendingLevel.level}
        onComplete={handleBriefingComplete}
      />
    );
  }

  return (
    <GameContainer
      roomCode={roomCode}
      players={players}
      role={activeLevel?.role || pendingLevel?.role || role}
      waiting={waiting}
      syncing={syncing}
      levelData={activeLevel || pendingLevel}
      timer={timer}
      score={score}
      trustScore={trustScore}
      signal={signal}
      feedback={feedback}
      onSelect={handleSelect}
      onSendSignal={handleSendSignal}
    />
  );
}
