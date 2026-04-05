const Room = require("../models/Room");
const LeaderboardEntry = require("../models/LeaderboardEntry");

const { generateLevelData } = require("../engine/levelManager");
const { applyAIDeception } = require("../engine/aiEngine");

const persistLeaderboard = async (room) => {
  if (!room || room.status === "finished") {
    return;
  }

  const score = room.score || 0;

  for (const player of room.players || []) {
    if (!player.name) continue;

    await LeaderboardEntry.findOneAndUpdate(
      { name: player.name },
      {
        $inc: {
          totalScore: score,
          gamesPlayed: 1,
        },
        $max: {
          bestScore: score,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  room.status = "finished";
  await room.save();
};

const handleGameSockets = (io, socket) => {
  const allowedSignals = ["ALPHA", "BETA", "GAMMA"];

  socket.on("start_level", async ({ roomCode }) => {
    try {
      const normalizedRoomCode = roomCode?.trim()?.toUpperCase();
      console.log("START LEVEL SOCKET:", { socketId: socket.id, roomCode: normalizedRoomCode });

      if (!normalizedRoomCode) {
        return socket.emit("error", "roomCode is required");
      }

      const room = await Room.findOne({ roomCode: normalizedRoomCode });

      if (!room) {
        console.log("START LEVEL SOCKET NOT FOUND:", normalizedRoomCode);
        return socket.emit("error", "Room not found");
      }

      if (!room.level) {
        room.level = 1;
      }

      console.log("START LEVEL ROOM:", normalizedRoomCode, (room.players || []).map((player) => ({
        name: player.name,
        socketId: player.socketId,
        role: player.role,
      })));

      const levelData = generateLevelData(room.level);
      const finalData = applyAIDeception(levelData, room.level);

      room.currentAnswer = levelData.correctAnswer;
      await room.save();

      let timeLimit = 15;
      if (room.level >= 4) timeLimit = 10;
      if (room.level >= 5) timeLimit = 7;
      if (room.level >= 6) timeLimit = 5;

      io.to(normalizedRoomCode).emit("timer_start", {
        time: timeLimit,
      });

      setTimeout(async () => {
        try {
          const updatedRoom = await Room.findOne({ roomCode: normalizedRoomCode });

          if (!updatedRoom || updatedRoom.currentAnswer == null) return;

          updatedRoom.score = (updatedRoom.score || 0) - 5;
          updatedRoom.currentAnswer = null;
          updatedRoom.level = (updatedRoom.level || 1) + 1;
          await updatedRoom.save();

          if (updatedRoom.level > 6) {
            await persistLeaderboard(updatedRoom);
            return io.to(normalizedRoomCode).emit("game_over", {
              score: updatedRoom.score,
            });
          }

          io.to(normalizedRoomCode).emit("time_up", {
            message: "TIME UP",
            score: updatedRoom.score,
            level: updatedRoom.level,
          });
        } catch (timeoutError) {
          console.error("TIMEOUT ERROR:", timeoutError.message);
        }
      }, timeLimit * 1000);

      room.players.forEach((player) => {
        if (player.role === "analyst") {
          io.to(player.socketId).emit("level_data", {
            clue: finalData.clue,
            role: "analyst",
            level: room.level,
          });
        }

        if (player.role === "operator") {
          io.to(player.socketId).emit("level_data", {
            options: finalData.options,
            role: "operator",
            level: room.level,
          });
        }
      });
    } catch (error) {
      console.error("LEVEL ERROR:", error.message);
      socket.emit("error", "Error starting level");
    }
  });

  socket.on("send_signal", ({ roomCode, signal }) => {
    const normalizedRoomCode = roomCode?.trim()?.toUpperCase();
    const normalizedSignal = signal?.trim()?.toUpperCase();

    if (!normalizedRoomCode) {
      return socket.emit("error", "Room not found");
    }

    if (!allowedSignals.includes(normalizedSignal)) {
      return socket.emit("error", "Invalid signal");
    }

    socket.to(normalizedRoomCode).emit("receive_signal", normalizedSignal);
  });

  socket.on("select_option", async ({ roomCode, option }) => {
    try {
      const normalizedRoomCode = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: normalizedRoomCode });

      if (!room) {
        return socket.emit("error", "Room not found");
      }

      const correctAnswer = room.currentAnswer;
      const isCorrect = option === correctAnswer;
      room.score = room.score || 0;
      room.score += isCorrect ? 10 : -5;
      room.currentAnswer = null;
      room.level = (room.level || 1) + 1;

      if (room.level > 6) {
        await room.save();
        await persistLeaderboard(room);
        return io.to(normalizedRoomCode).emit("game_over", {
          score: room.score,
        });
      }

      await room.save();

      io.to(normalizedRoomCode).emit("result", {
        correct: isCorrect,
        score: room.score,
        level: room.level,
      });
    } catch (error) {
      console.error("GAME ERROR:", error.message);
      socket.emit("error", "Error selecting option");
    }
  });
};

module.exports = handleGameSockets;
