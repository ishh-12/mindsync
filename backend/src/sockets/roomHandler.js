const Room = require("../models/Room");

const cleanupDisconnectedPlayers = async (io, room) => {
  room.players = (room.players || []).filter((player) => {
    if (!player?.name?.trim()) {
      return false;
    }

    if (!player.socketId) {
      return false;
    }

    return io.sockets.sockets.has(player.socketId);
  });

  return room;
};

const handleRoomSockets = (io, socket) => {
  socket.on("join_room", async ({ roomCode, name }) => {
    try {
      const normalizedRoomCode = roomCode?.trim()?.toUpperCase();
      const normalizedName = name?.trim();
      console.log("JOIN ROOM SOCKET:", { socketId: socket.id, roomCode: normalizedRoomCode, name: normalizedName });

      if (!normalizedRoomCode || !normalizedName) {
        return socket.emit("error", "roomCode and name are required");
      }

      const room = await Room.findOne({ roomCode: normalizedRoomCode });

      if (!room) {
        console.log("JOIN ROOM SOCKET NOT FOUND:", normalizedRoomCode);
        return socket.emit("error", "Room not found");
      }

      await cleanupDisconnectedPlayers(io, room);

      let player = room.players.find(
        (entry) => entry.name?.toLowerCase() === normalizedName.toLowerCase()
      );

      if (!player) {
        const reusableSlot = room.players.find((entry) => !entry.socketId);

        if (reusableSlot) {
          reusableSlot.name = normalizedName;
          reusableSlot.socketId = socket.id;
          reusableSlot.role = reusableSlot.role || "";
          player = reusableSlot;
        } else {
          if (room.players.length >= 2) {
            await room.save();
            return socket.emit("error", "Room is full");
          }

          player = {
            name: normalizedName,
            socketId: socket.id,
            role: "",
          };
          room.players.push(player);
        }
      } else {
        player.name = normalizedName;
        player.socketId = socket.id;
      }

      await room.save();
      socket.join(normalizedRoomCode);

      console.log("JOIN ROOM SOCKET SAVED:", normalizedRoomCode, (room.players || []).map((player) => ({
        name: player.name,
        socketId: player.socketId,
        role: player.role,
      })));

      io.to(normalizedRoomCode).emit("room_update", room);
    } catch (err) {
      console.error("JOIN ROOM SOCKET ERROR:", err.message);
      socket.emit("error", "Error joining room");
    }
  });

  socket.on("start_game", async ({ roomCode }) => {
    try {
      const normalizedRoomCode = roomCode?.trim()?.toUpperCase();
      console.log("START GAME SOCKET:", { socketId: socket.id, roomCode: normalizedRoomCode });
      const room = await Room.findOne({ roomCode: normalizedRoomCode });

      if (!room) {
        console.log("START GAME SOCKET NOT FOUND:", normalizedRoomCode);
        return socket.emit("error", "Room not found");
      }

      await cleanupDisconnectedPlayers(io, room);
      console.log("START GAME SOCKET ROOM:", normalizedRoomCode, (room.players || []).map((player) => ({
        name: player.name,
        socketId: player.socketId,
        role: player.role,
      })));

      if (room.players.length < 2) {
        await room.save();
        return socket.emit("error", "Need 2 players");
      }

      room.players[0].role = "analyst";
      room.players[1].role = "operator";
      room.status = "playing";
      room.level = 1;
      room.score = 0;
      room.currentAnswer = null;
      await room.save();

      io.to(normalizedRoomCode).emit("game_started", {
        roomCode: normalizedRoomCode,
        players: room.players,
      });
    } catch (err) {
      console.error("START GAME SOCKET ERROR:", err.message);
      socket.emit("error", "Error starting game");
    }
  });

  socket.on("disconnect", async () => {
    try {
      const rooms = await Room.find({ "players.socketId": socket.id });

      for (const room of rooms) {
        room.players = (room.players || []).filter((entry) => entry.socketId !== socket.id);
        await room.save();
        io.to(room.roomCode).emit("room_update", room);
      }
    } catch (error) {
      console.error("DISCONNECT CLEANUP ERROR:", error.message);
    }
  });
};

module.exports = handleRoomSockets;
