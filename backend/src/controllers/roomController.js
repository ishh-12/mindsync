const Room = require("../models/Room");
const { generatePlayerToken } = require("../utils/playerAuth");

const serializeRoom = (room) => ({
  roomCode: room.roomCode,
  players: (room.players || []).map((player) => ({
    socketId: player.socketId ?? null,
    name: player.name ?? "",
    role: player.role ?? "",
    isHost: Boolean(player.isHost),
  })),
  status: room.status,
  level: room.level ?? room.currentLevel ?? 1,
  score: room.score ?? 0,
  trustScore: room.trustScore ?? 0,
});

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const createRoom = async (req, res) => {
  try {
    const { playerName, name } = req.body || {};
    const resolvedName = playerName ?? name;

    if (!resolvedName?.trim()) {
      return res.status(400).json({ success: false, message: "Name required" });
    }

    let roomCode = generateRoomCode();
    let exists = await Room.findOne({ roomCode });
    while (exists) {
      roomCode = generateRoomCode();
      exists = await Room.findOne({ roomCode });
    }

    const room = new Room({ roomCode, players: [], status: 'waiting' });
    await room.save();

    res.json({
      success: true,
      roomCode,
      token: generatePlayerToken({ roomCode, name: resolvedName.trim() }),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomCode, playerName, name } = req.body;
    const resolvedName = playerName ?? name;
    const code = roomCode?.toUpperCase().trim();
    
    if (!code || !resolvedName?.trim()) {
      return res.status(400).json({ success: false, message: 'Room code and name required' });
    }

    const room = await Room.findOne({ roomCode: code });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.players.length >= 2) {
      return res.status(400).json({ success: false, message: 'Room is full' });
    }

    res.json({
      success: true,
      room: serializeRoom(room),
      role: room.players.length === 0 ? 'analyst' : 'operator',
      token: generatePlayerToken({ roomCode: code, name: resolvedName.trim() }),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.roomCode.toUpperCase() });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, room: serializeRoom(room) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createRoom, joinRoom, getRoom };
