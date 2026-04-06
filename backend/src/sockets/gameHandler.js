const Room = require("../models/Room");
const LeaderboardEntry = require("../models/LeaderboardEntry");
const { generateLevelData } = require("../engine/levelManager");
const { applyAIDeception } = require("../engine/aiEngine");

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
      if (levelData.corrupt && levelData.fakeDanger) {
        operatorData.danger = levelData.fakeDanger;
      }
      io.to(player.socketId).emit("level_data", {
        role: "operator",
        level: room.level,
        name: levelData.name,
        subtitle: levelData.subtitle,
        operatorData,
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
      if (room.players.length < 2) return socket.emit("error", "Need 2 players to start");

      if (!room.level || room.level < 1) room.level = 1;

      const levelData = generateLevelData(room.level);
      const finalData = applyAIDeception(levelData, room.level, room);

      console.log(`LEVEL ${room.level} | Answer: ${levelData.correctAnswer} | Corrupt: ${levelData.corrupt}`);

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
            return io.to(code).emit("game_over", { score: updated.score });
          }

          io.to(code).emit("time_up", {
            message: "TIME UP — THEY GOT IN",
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
  socket.on("send_signal", ({ roomCode, signal }) => {
    const code = roomCode?.trim()?.toUpperCase();
    const sig = signal?.trim()?.toUpperCase();
    if (!code) return socket.emit("error", "roomCode is required");
    if (!ALLOWED_SIGNALS.includes(sig)) return socket.emit("error", `Invalid signal. Use: ${ALLOWED_SIGNALS.join(", ")}`);
    socket.to(code).emit("receive_signal", sig);
    console.log(`SIGNAL: ${sig} in ${code}`);
  });

  // ── select_option ──────────────────────────────────────────────────────────
  socket.on("select_option", async ({ roomCode, option }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: code });
      if (!room) return socket.emit("error", "Room not found");
      if (room.currentAnswer == null) return;

      clearRoomTimeout(code);

      const isCorrect = String(option).trim() === String(room.currentAnswer).trim();

      room.score = room.score || 0;
      room.trustScore = room.trustScore || 0;
      room.lastChoices = room.lastChoices || [];

      let points = isCorrect ? 10 : -5;
      if (isCorrect && room.level === 5) points += 15;
      if (isCorrect && room.level === 6) points += 20;

      room.score += points;
      room.trustScore += isCorrect ? 1 : -1;
      room.lastChoices.push(String(option));
      if (room.lastChoices.length > 3) room.lastChoices.shift();

      room.currentAnswer = null;
      room.level = (room.level || 1) + 1;

      if (room.level > 6) {
        await room.save();
        await persistLeaderboard(room);
        return io.to(code).emit("game_over", { score: room.score });
      }

      await room.save();
      io.to(code).emit("result", {
        correct: isCorrect,
        score: room.score,
        level: room.level,
        trustScore: room.trustScore,
      });
    } catch (err) {
      console.error("SELECT OPTION ERROR:", err.message);
      socket.emit("error", "Error selecting option");
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