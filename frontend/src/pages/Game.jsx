import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../services/socket";
import GameContainer from "../features/game/GameContainer";


export default function Game() {
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [gameData, setGameData] = useState({});
  const [timer, setTimer] = useState(0);
  const [signal, setSignal] = useState("");
  const [result, setResult] = useState(null);

  // 🔥 START FIRST LEVEL
  useEffect(() => {
    socket.emit("start_level", { roomCode });
  }, [roomCode]);

  // 🔥 SOCKET LISTENERS
  useEffect(() => {

    socket.on("level_data", (data) => {
      console.log("LEVEL DATA:", data);
      setGameData(data);
    });

    socket.on("timer_start", (data) => {
      console.log("TIMER:", data);
      setTimer(data.time);
    });

    socket.on("receive_signal", (signal) => {
      console.log("SIGNAL:", signal);
      setSignal(signal);
    });

    socket.on("result", (res) => {
      console.log("RESULT:", res);
      setResult(res);

      // 🔥 auto next level
      setTimeout(() => {
        socket.emit("start_level", { roomCode });
      }, 1500);
    });

    socket.on("time_up", (data) => {
      console.log("TIME UP:", data);

      setTimeout(() => {
        socket.emit("start_level", { roomCode });
      }, 1500);
    });

    socket.on("game_over", (data) => {
      console.log("GAME OVER:", data);
      navigate("/result", { state: data });
    });

    return () => {
      socket.off("level_data");
      socket.off("timer_start");
      socket.off("receive_signal");
      socket.off("result");
      socket.off("time_up");
      socket.off("game_over");
    };

  }, [roomCode, navigate]);

  // 🎮 RENDER GAME UI
  return (
    <GameContainer
      gameData={gameData}
      timer={timer}
      signal={signal}
      result={result}
      roomCode={roomCode}
    />
  );
}