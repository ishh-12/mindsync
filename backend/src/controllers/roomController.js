const Room = require("../models/Room");

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

const createRoom = async (_req, res) => {
  try {
    const roomCode = generateRoomCode();
    console.log("CREATED ROOM:", roomCode);

    const newRoom = new Room({
      roomCode,
      players: [],
    });

    await newRoom.save();

    res.status(201).json({
      success: true,
      roomCode,
    });
  } catch (error) {
    console.error("CREATE ROOM ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating room",
    });
  }
};

const joinRoom = async (req, res) => {
  try {
    const roomCode = req.body?.roomCode?.trim()?.toUpperCase();
    const name = req.body?.name?.trim();
    console.log("JOIN ROOM HTTP:", { roomCode, name });

    if (!roomCode || !name) {
      return res.status(400).json({
        success: false,
        message: "roomCode and name are required",
      });
    }

    const room = await Room.findOne({ roomCode });

    if (!room) {
      console.log("JOIN ROOM HTTP NOT FOUND:", roomCode);
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    console.log(
      "JOIN ROOM HTTP FOUND:",
      roomCode,
      "players:",
      (room.players || []).map((player) => ({
        name: player.name,
        socketId: player.socketId,
        role: player.role,
      }))
    );

    if (!Array.isArray(room.players)) {
      room.players = [];
    }

    room.players = room.players.filter((entry) => {
      if (!entry?.name?.trim()) {
        return false;
      }

      if (entry.socketId) {
        return true;
      }

      return entry.name.trim().toLowerCase() === name.toLowerCase();
    });

    let player = room.players.find(
      (entry) => entry.name?.toLowerCase() === name.toLowerCase()
    );

    if (!player) {
      const occupiedPlayers = room.players.filter((entry) => entry.name?.trim());

      if (occupiedPlayers.length >= 2) {
        return res.status(400).json({
          success: false,
          message: "Room is full",
        });
      }

      player = {
        name,
        socketId: "",
        role: "",
      };
      room.players.push(player);
    }

    await room.save();

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("JOIN ROOM ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error joining room",
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const roomCode = req.params?.roomCode?.trim()?.toUpperCase();

    if (!roomCode) {
      return res.status(400).json({
        success: false,
        message: "Room code required",
      });
    }

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("GET ROOM ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching room",
    });
  }
};

const startGame = async (req, res) => {
  try {
    const roomCode = req.body?.roomCode?.trim()?.toUpperCase();
    console.log("STARTING ROOM:", roomCode);

    if (!roomCode) {
      return res.status(400).json({
        success: false,
        message: "roomCode is required",
      });
    }

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.players.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Need 2 players",
      });
    }

    room.players[0].role = "analyst";
    room.players[1].role = "operator";
    room.status = "playing";

    await room.save();

    return res.json({
      success: true,
      message: "Game started",
    });
  } catch (error) {
    console.error("START GAME ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error starting game",
    });
  }
};

module.exports = { createRoom, joinRoom, getRoom, startGame };
