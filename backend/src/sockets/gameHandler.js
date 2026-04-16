const Room = require("../models/Room");
const LeaderboardEntry = require("../models/LeaderboardEntry");
const { generateLevelData } = require("../engine/levelManager");
const { applyAIDeception } = require("../engine/aiEngine");
const { getPlayer, requireRole } = require("../utils/auth");

// In-memory timeout store — never saved to MongoDB
const timeoutMap = {};

const persistLeaderboard = async (room) => {
  if (!room || room.status === "finished") return;
  const score = room.score || 0;
  const teamMembers = [...new Set(
    (room.players || []).map((p) => p?.name?.trim()).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));
  if (teamMembers.length === 0) return;
  const teamName = teamMembers.join(" + ");
  await LeaderboardEntry.findOneAndUpdate(
    { name: teamName },
    { $inc: { totalScore: score, gamesPlayed: 1 }, $max: { bestScore: score } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  room.status = "finished";
  await room.save();
};

const clearRoomTimeout = (code) => {
  if (timeoutMap[code]) {
    clearTimeout(timeoutMap[code]);
    delete timeoutMap[code];
  }
};

const getTimeLimit = (level) => {
  if (level >= 6) return 8;
  if (level >= 5) return 15;
  if (level >= 4) return 20;
  return 25;
};

const emitLevelToPlayers = (io, room, levelData, finalData) => {
  room.players.forEach((player) => {
    if (player.role === "operator") {
      const operatorData = { ...levelData.operatorData };
      if (levelData.corrupt && finalData.fakeDanger) {
        operatorData.danger = finalData.fakeDanger;
      }
      if (levelData.corrupt && finalData.fakeValue) {
        operatorData.value = finalData.fakeValue;
      }
      io.to(player.socketId).emit("level_data", {
        role: "operator",
        level: room.level,
        name: levelData.name,
        subtitle: levelData.subtitle,
        operatorData,
        operatorNote: finalData.operatorNote,
        silenced: levelData.silenced,
        corrupt: levelData.corrupt,
        hint: levelData.description,
      });
    }
    if (player.role === "analyst") {
      io.to(player.socketId).emit("level_data", {
        role: "analyst",
        level: room.level,
        name: levelData.name,
        subtitle: levelData.subtitle,
        clue: finalData.clue,
        hint: finalData.clue,
        analystBrief: finalData.analystBrief,
        options: levelData.options,
        isCorrupted: finalData.isClueCorrupted,
        silenced: levelData.silenced,
        corrupt: levelData.corrupt,
      });
    }
  });
};

const handleGameSockets = (io, socket) => {
  const ALLOWED_SIGNALS = ["STATIC", "SIGNAL", "BREACH"];

  // ── join_room ──────────────────────────────────────────────────────────────
  socket.on("join_room", async ({ roomCode, name }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const playerName = name?.trim();

      const player = {
  socketId: socket.id,  // 🔥 THIS MUST EXIST
  name,
  role,
};
console.log("JOINED PLAYER:", player);

      if (!code || !playerName) return socket.emit("error", "roomCode and name are required");

      const room = await Room.findOne({ roomCode: code });
      if (!room) return socket.emit("error", "Room not found");

      // Check if this player name already exists in the room (reconnect)
      const existingByName = room.players.find(
        (p) => p.name?.toLowerCase() === playerName.toLowerCase()
      );

      // Check if this socket ID already exists (duplicate join call)
      const existingBySocket = room.players.find(
        (p) => p.socketId === socket.id
      );

      if (existingBySocket) {
        // Already joined with this socket — just re-join the socket room and re-emit role
        socket.join(code);
        socket.emit("role_assigned", { role: existingBySocket.role });
        io.to(code).emit("room_update", {
          roomCode: code,
          players: room.players.map((p) => ({ name: p.name, role: p.role })),
          status: room.status,
        });
        if (room.players.length === 2) {
          io.to(code).emit("ready_to_start", { roomCode: code });
        }
        return;
      }

      if (existingByName) {
        // Same player reconnecting with new socket ID — update it
        existingByName.socketId = socket.id;
        await room.save();
        socket.join(code);
        socket.emit("role_assigned", { role: existingByName.role });
        io.to(code).emit("room_update", {
          roomCode: code,
          players: room.players.map((p) => ({ name: p.name, role: p.role })),
          status: room.status,
        });
        if (room.players.length === 2) {
          io.to(code).emit("ready_to_start", { roomCode: code });
        }
        return;
      }

      // Brand new player joining
      if (room.players.length >= 2) {
        return socket.emit("error", "Room is full");
      }

      const role = room.players.length === 0 ? "operator" : "analyst";
      room.players.push({ socketId: socket.id, name: playerName, role });
      await room.save();

      socket.join(code);
      console.log(`JOIN: ${playerName} as ${role} in ${code}`);

      socket.emit("role_assigned", { role });
      io.to(code).emit("room_update", {
        roomCode: code,
        players: room.players.map((p) => ({ name: p.name, role: p.role })),
        status: room.status,
      });

      if (room.players.length === 2) {
        io.to(code).emit("ready_to_start", { roomCode: code });
      }

    } catch (err) {
      console.error("JOIN ERROR:", err.message);
      socket.emit("error", "Error joining room");
    }
  });

  // ── start_level ────────────────────────────────────────────────────────────
  socket.on("start_level", async ({ roomCode }) => {
  try {
    const code = roomCode?.trim()?.toUpperCase();
    if (!code) return socket.emit("error", "roomCode is required");

    const room = await Room.findOne({ roomCode: code });
    if (!room) return socket.emit("error", "Room not found");
    if (room.players.length < 2) return socket.emit("error", "Need 2 players");

    // 🔐 AUTH
    const player = getPlayer(room, socket);
    console.log("AUTH CHECK PLAYER:", player);
    if (!requireRole(player, "operator", socket)) return;

    if (!room.level || room.level < 1) room.level = 1;

    const levelData = generateLevelData(room.level);
    const finalData = applyAIDeception(levelData, room.level, room);

    console.log("EVENT:", {
      type: "START_LEVEL",
      room: code,
      user: socket.id,
      level: room.level,
    });

    room.currentAnswer = levelData.correctAnswer;
    room.status = "playing";
    await room.save();

    const timeLimit = getTimeLimit(room.level);

    io.to(code).emit("timer_start", { time: timeLimit });

    emitLevelToPlayers(io, room, levelData, finalData);

    clearRoomTimeout(code);

    timeoutMap[code] = setTimeout(async () => {
      try {
        const updated = await Room.findOne({ roomCode: code });

        if (!updated || updated.currentAnswer == null) return;
        if (updated.level !== room.level) return;

        updated.score = (updated.score || 0) - 5;
        updated.currentAnswer = null;
        updated.level = (updated.level || 1) + 1;

        await updated.save();
        delete timeoutMap[code];

        if (updated.level > 6) {
          await persistLeaderboard(updated);
          return io.to(code).emit("game_over", {
            score: updated.score,
          });
        }

        io.to(code).emit("time_up", {
          message: "TIME UP",
          score: updated.score,
          level: updated.level,
        });

      } catch (err) {
        console.error("TIMEOUT ERROR:", err.message);
      }
    }, timeLimit * 1000);

  } catch (err) {
    console.error("START LEVEL ERROR:", err.message);
    socket.emit("error", "Error starting level");
  }
});
  // ── send_signal ────────────────────────────────────────────────────────────
 socket.on("send_signal", async ({ roomCode, signal }) => {
  try {
    const code = roomCode?.trim()?.toUpperCase();
    if (!code) return socket.emit("error", "roomCode is required");

    const room = await Room.findOne({ roomCode: code });
    if (!room) return socket.emit("error", "Room not found");

    // 🔐 AUTH
    const player = getPlayer(room, socket);
    console.log("AUTH CHECK PLAYER:", player);
    if (!requireRole(player, "operator", socket)) return;

    const levelData = generateLevelData(room.level);

    // 🚫 Block signals in silenced levels
    if (levelData.silenced) {
      return socket.emit("error", "Signals disabled in this level");
    }

    const allowedSignals = ["STATIC", "SIGNAL", "BREACH"];

    if (!allowedSignals.includes(signal)) {
      return socket.emit("error", "Invalid signal");
    }

    console.log("EVENT:", {
      type: "SEND_SIGNAL",
      room: code,
      user: socket.id,
      signal,
    });

    // 📡 Send signal to analyst
    room.players.forEach((p) => {
      if (p.role === "analyst") {
        io.to(p.socketId).emit("signal_received", signal);
      }
    });

  } catch (err) {
    console.error("SIGNAL ERROR:", err.message);
  }
});
  // ── select_option ──────────────────────────────────────────────────────────
  socket.on("select_option", async ({ roomCode, option }) => {
  try {
    const code = roomCode?.trim()?.toUpperCase();
    if (!code) return socket.emit("error", "roomCode is required");

    const room = await Room.findOne({ roomCode: code });
    if (!room) return socket.emit("error", "Room not found");

    // 🔐 AUTH
    const player = getPlayer(room, socket);
    console.log("AUTH CHECK PLAYER:", player);
    if (!requireRole(player, "analyst", socket)) return;

    if (room.currentAnswer == null) {
      return socket.emit("error", "No active question");
    }

    const isCorrect = option === room.currentAnswer;

    let points = isCorrect ? 10 : -5;

    if (isCorrect && room.level === 5) points += 15;
    if (isCorrect && room.level === 6) points += 20;

    room.score = (room.score || 0) + points;

    room.currentAnswer = null;
    room.level = (room.level || 1) + 1;

    await room.save();

    console.log("EVENT:", {
      type: "SELECT_OPTION",
      room: code,
      user: socket.id,
      option,
      correct: isCorrect,
    });

    if (room.level > 6) {
      await persistLeaderboard(room);

      return io.to(code).emit("game_over", {
        score: room.score,
      });
    }

    io.to(code).emit("level_result", {
      correct: isCorrect,
      score: room.score,
      level: room.level,
    });

  } catch (err) {
    console.error("ANSWER ERROR:", err.message);
    socket.emit("error", "Error processing answer");
  }
});
  // ── disconnect ─────────────────────────────────────────────────────────────
  socket.on("disconnect", async () => {
    try {
      const rooms = await Room.find({ "players.socketId": socket.id });
      for (const room of rooms) {
        room.players = room.players.filter((p) => p.socketId !== socket.id);
        await room.save();
        io.to(room.roomCode).emit("room_update", {
          roomCode: room.roomCode,
          players: room.players.map((p) => ({ name: p.name, role: p.role })),
          status: room.status,
        });
      }
    } catch (err) {
      console.error("DISCONNECT ERROR:", err.message);
    }
  });
};

module.exports = handleGameSockets;