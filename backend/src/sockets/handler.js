const Room = require("../models/Room");
const LeaderboardEntry = require("../models/LeaderboardEntry");

const timeoutMap = {};
const introTimeoutMap = {};
const readinessMap = {};

const LEVELS = [
  {
    id: 1, name: 'WARMUP', subtitle: 'THREAT ASSESSMENT',
    duration: 30, operatorData: { label: 'THREAT LEVEL', value: '20', danger: 'HIGH' },
    options: ['18', '19', '20', '21'], answer: '20',
    corrupt: false, silenced: false, description: 'HIGH = exact match. Stay focused.',
    hint: 'The number shown is the answer. Pick: 20'
  },
  {
    id: 2, name: 'INFECTION ZONE', subtitle: 'EVACUATION PROTOCOL',
    duration: 30, operatorData: { label: 'EVACUATE TO', value: 'ROOF', danger: 'LOW' },
    options: ['BASEMENT', 'ROOF', 'TUNNEL', 'GARAGE'], answer: 'ROOF',
    corrupt: false, silenced: false, description: 'LOW = safest route. Pick: ROOF',
    hint: 'ROOF is shown - that is the safest. Pick: ROOF'
  },
  {
    id: 3, name: 'BIOHAZARD', subtitle: 'CORRUPTED TRANSMISSION',
    duration: 25, operatorData: { label: 'THREAT', value: '☣️', danger: 'MEDIUM' },
    fakeDanger: 'LOW', options: ['🧟', '☣️', '💉', '🔥'], answer: '☣️',
    corrupt: true, silenced: false, description: '⚠ AI CORRUPTED THE DANGER LEVEL',
    hint: 'The AI is lying! ☣️ is still the answer. Pick: ☣️'
  },
  {
    id: 4, name: 'QUARANTINE ZONE', subtitle: 'MEDICAL EMERGENCY',
    duration: 25, operatorData: { label: 'INFECTED SYMPTOM', value: 'FOAMING MOUTH', danger: 'HIGH' },
    options: ['FEVER', 'LIMPING', 'FOAMING MOUTH', 'BLEEDING EYES'], answer: 'FOAMING MOUTH',
    corrupt: false, silenced: false, description: 'HIGH = most severe symptom. Pick: FOAMING MOUTH',
    hint: 'FOAMING MOUTH is the worst. HIGH danger = most severe. Pick: FOAMING MOUTH'
  },
  {
    id: 5, name: 'BLACKOUT', subtitle: 'SIGNAL JAMMED',
    duration: 20, operatorData: { label: 'THREAT', value: '???', danger: '???' },
    options: ['SEAL DOOR', 'RUN', 'HIDE', 'FIGHT'], answer: 'HIDE',
    corrupt: false, silenced: true, description: '⛔ ALL SIGNALS JAMMED. Pick: HIDE',
    hint: 'No signals work! Trust survival instinct. Pick: HIDE'
  },
  {
    id: 6, name: 'LAST SURVIVOR', subtitle: 'FINAL ORDER',
    duration: 8, operatorData: { label: 'FINAL ORDER', value: 'DETONATE BUNKER', danger: 'HIGH' },
    options: ['EVACUATE', 'HIDE', 'DETONATE BUNKER', 'SEND SOS'], answer: 'DETONATE BUNKER',
    corrupt: false, silenced: false, description: 'BREACH = most extreme. Pick: DETONATE BUNKER',
    hint: 'BREACH = highest stakes! Only DETONATE BUNKER matches. Pick: DETONATE BUNKER'
  }
];

const totalLevels = LEVELS.length;

const serializePlayers = (players = []) =>
  players.map((player) => ({
    name: player.name,
    role: player.role,
  }));

const buildLevelPayload = (room, player, level) => ({
  role: player.role,
  level: room.level,
  totalLevels,
  name: level.name,
  subtitle: level.subtitle,
  operatorData: {
    ...level.operatorData,
    danger: level.corrupt && level.fakeDanger ? level.fakeDanger : level.operatorData.danger,
  },
  actualOperatorData: level.operatorData,
  options: level.options,
  clue: level.description,
  hint: level.hint,
  corrupt: level.corrupt,
  silenced: level.silenced,
  duration: level.duration,
});

const clearRoomTimeout = (code) => {
  if (timeoutMap[code]) {
    clearTimeout(timeoutMap[code]);
    delete timeoutMap[code];
  }
};

const clearIntroTimeout = (code) => {
  if (introTimeoutMap[code]) {
    clearTimeout(introTimeoutMap[code]);
    delete introTimeoutMap[code];
  }
};

const clearReadiness = (code) => {
  delete readinessMap[code];
};

const getLeaderboardSnapshot = async () => {
  return LeaderboardEntry.find()
    .sort({ bestScore: -1, totalScore: -1, gamesPlayed: -1, name: 1 })
    .limit(10)
    .lean();
};

const finishGame = async (io, room) => {
  room.status = "finished";
  room.currentAnswer = null;
  room.roundActive = false;
  await room.save();

  if (room.score > 0) {
    const teamName = room.players.map((p) => p.name).sort().join(" + ");
    await LeaderboardEntry.findOneAndUpdate(
      { name: teamName },
      { $inc: { totalScore: room.score, gamesPlayed: 1 }, $max: { bestScore: room.score } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  const leaderboard = await getLeaderboardSnapshot();

  io.to(room.roomCode).emit("game_over", {
    score: room.score || 0,
    trustScore: room.trustScore || 0,
    players: serializePlayers(room.players),
    leaderboard,
  });
};

const emitLevelIntro = async (io, roomCode) => {
  const room = await Room.findOne({ roomCode });
  if (!room) return;

  clearRoomTimeout(roomCode);
  clearIntroTimeout(roomCode);
  clearReadiness(roomCode);

  const levelIndex = (room.level || 1) - 1;
  const level = LEVELS[levelIndex];

  if (!level || room.level > totalLevels) {
    await finishGame(io, room);
    return;
  }

  room.status = "briefing";
  room.currentAnswer = null;
  room.roundActive = false;
  await room.save();

  room.players.forEach((player) => {
    io.to(player.socketId).emit("level_intro", buildLevelPayload(room, player, level));
  });
};

const scheduleNextLevelIntro = (io, roomCode, delayMs = 1800) => {
  clearIntroTimeout(roomCode);
  introTimeoutMap[roomCode] = setTimeout(async () => {
    try {
      await emitLevelIntro(io, roomCode);
    } catch (err) {
      console.error("[INTRO ERROR]", err.message);
    } finally {
      clearIntroTimeout(roomCode);
    }
  }, delayMs);
};

const handleSocket = (io, socket) => {

  socket.on('join_room', async ({ roomCode, name }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const playerName = name?.trim();

      if (!code || !playerName) {
        return socket.emit('error', 'roomCode and name are required');
      }

      const room = await Room.findOne({ roomCode: code });
      if (!room) {
        return socket.emit('error', 'Room not found');
      }

      const existingBySocket = room.players.find((p) => p.socketId === socket.id);
      if (existingBySocket) {
        socket.join(code);
        socket.emit('role_assigned', { role: existingBySocket.role });
        io.to(code).emit('room_update', {
          roomCode: code,
          players: serializePlayers(room.players),
          status: room.status,
        });
        return;
      }

      const existingByName = room.players.find(
        (p) => p.name?.toLowerCase() === playerName.toLowerCase()
      );
      if (existingByName) {
        existingByName.socketId = socket.id;
        await room.save();
        socket.join(code);
        socket.emit('role_assigned', { role: existingByName.role });
        io.to(code).emit('room_update', {
          roomCode: code,
          players: serializePlayers(room.players),
          status: room.status,
        });
        return;
      }

      if (room.players.length >= 2) {
        return socket.emit('error', 'Room is full');
      }

      // First player = analyst, second = operator
      const role = room.players.length === 0 ? 'analyst' : 'operator';
      room.players.push({ socketId: socket.id, name: playerName, role });
      await room.save();

      socket.join(code);
      socket.emit('role_assigned', { role });
      io.to(code).emit('room_update', {
        roomCode: code,
        players: serializePlayers(room.players),
        status: room.status,
      });

      if (room.players.length === 2) {
        io.to(code).emit('ready_to_start', { roomCode: code });
      }

    } catch (err) {
      console.error('[JOIN ERROR]', err.message);
      socket.emit('error', 'Error joining room');
    }
  });

  socket.on('start_game', async ({ roomCode }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: code });

      if (!room) return socket.emit('error', 'Room not found');
      if (room.players.length < 2) return socket.emit('error', 'Need 2 players');

      room.status = 'playing';
      room.level = 1;
      room.score = 0;
      room.currentAnswer = null;
      room.trustScore = 0;
      room.lastChoices = [];
      room.roundActive = false;
      await room.save();

      io.to(code).emit('game_started', {
        roomCode: code,
        players: serializePlayers(room.players),
      });

      scheduleNextLevelIntro(io, code, 700);

    } catch (err) {
      console.error('[START GAME ERROR]', err.message);
      socket.emit('error', 'Error starting game');
    }
  });

  socket.on('start_level', async ({ roomCode }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: code });

      if (!room) return socket.emit('error', 'Room not found');
      if (room.players.length < 2) return socket.emit('error', 'Need 2 players');

      await emitLevelIntro(io, code);

    } catch (err) {
      console.error('[START LEVEL ERROR]', err.message);
      socket.emit('error', 'Error starting level');
    }
  });

  socket.on("ready_for_level", async ({ roomCode, level }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: code });

      if (!room) return socket.emit("error", "Room not found");
      if (room.players.length < 2) return socket.emit("error", "Need 2 players");
      if ((room.level || 1) !== Number(level)) return;
      if (room.roundActive) return;

      if (!readinessMap[code]) readinessMap[code] = new Set();
      readinessMap[code].add(socket.id);

      const activeSocketIds = room.players.map((player) => player.socketId).filter(Boolean);
      const everyoneReady =
        activeSocketIds.length > 0 &&
        activeSocketIds.every((socketId) => readinessMap[code].has(socketId));

      if (!everyoneReady) {
        return io.to(code).emit("level_sync", {
          level: room.level,
          readyCount: readinessMap[code].size,
          playerCount: activeSocketIds.length,
        });
      }

      const levelIndex = (room.level || 1) - 1;
      const currentLevel = LEVELS[levelIndex];

      if (!currentLevel) {
        await finishGame(io, room);
        return;
      }

      room.currentAnswer = currentLevel.answer;
      room.status = "playing";
      room.roundActive = true;
      await room.save();

      room.players.forEach((player) => {
        io.to(player.socketId).emit("level_data", buildLevelPayload(room, player, currentLevel));
      });

      io.to(code).emit("timer_start", { level: room.level, time: currentLevel.duration });
      clearReadiness(code);

      clearRoomTimeout(code);
      timeoutMap[code] = setTimeout(async () => {
        try {
          const updatedRoom = await Room.findOne({ roomCode: code });
          if (!updatedRoom || updatedRoom.currentAnswer == null) return;

          const completedLevel = updatedRoom.level || 1;
          updatedRoom.score = (updatedRoom.score || 0) - 5;
          updatedRoom.currentAnswer = null;
          updatedRoom.roundActive = false;
          updatedRoom.level = completedLevel + 1;
          await updatedRoom.save();

          clearRoomTimeout(code);

          io.to(code).emit("time_up", {
            message: "TIME UP",
            score: updatedRoom.score,
            trustScore: updatedRoom.trustScore || 0,
            level: updatedRoom.level,
            completedLevel,
            points: -5,
            correct: false,
            gameOver: completedLevel >= totalLevels,
          });

          if (completedLevel >= totalLevels) {
            await finishGame(io, updatedRoom);
            return;
          }

          scheduleNextLevelIntro(io, code);
        } catch (err) {
          console.error("[TIMEOUT ERROR]", err.message);
        }
      }, currentLevel.duration * 1000);
    } catch (err) {
      console.error("[READY LEVEL ERROR]", err.message);
      socket.emit("error", "Error preparing level");
    }
  });

  socket.on('send_signal', async ({ roomCode, signal }) => {
    const code = roomCode?.trim()?.toUpperCase();
    const sig = signal?.trim()?.toUpperCase();
    if (!code) return;
    
    try {
      const room = await Room.findOne({ roomCode: code });
      if (room) {
        const analystPlayer = room.players.find(p => p.role === 'analyst');
        if (analystPlayer) {
          io.to(analystPlayer.socketId).emit('receive_signal', sig);
        }
      }
    } catch (err) {
      console.error('[SEND SIGNAL ERROR]', err.message);
    }
    
    console.log(`[SIGNAL] ${sig} in ${code}`);
  });

  socket.on('select_option', async ({ roomCode, option }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: code });

      if (!room || room.currentAnswer == null) return;

      clearRoomTimeout(code);

      const completedLevel = room.level || 1;
      const correctAnswer = room.currentAnswer;
      const isCorrect = String(option).trim() === String(room.currentAnswer).trim();
      let points = isCorrect ? 10 : -5;
      if (isCorrect && completedLevel === 5) points += 15;
      if (isCorrect && completedLevel === 6) points += 20;

      room.score = (room.score || 0) + points;
      room.trustScore = (room.trustScore || 0) + (isCorrect ? 1 : -1);
      room.currentAnswer = null;
      room.roundActive = false;
      room.level = completedLevel + 1;
      await room.save();

      io.to(code).emit('result', {
        correct: isCorrect,
        completedLevel,
        points,
        score: room.score,
        level: room.level,
        trustScore: room.trustScore,
        selectedOption: option,
        correctAnswer,
        gameOver: completedLevel >= totalLevels,
      });

      if (completedLevel >= totalLevels) {
        await finishGame(io, room);
        return;
      }

      scheduleNextLevelIntro(io, code);

    } catch (err) {
      console.error('[SELECT OPTION ERROR]', err.message);
      socket.emit('error', 'Error selecting option');
    }
  });

  socket.on('disconnect', async () => {
    try {
      const rooms = await Room.find({ 'players.socketId': socket.id });
      for (const room of rooms) {
        clearRoomTimeout(room.roomCode);
        clearIntroTimeout(room.roomCode);
        clearReadiness(room.roomCode);
        room.players = room.players.filter(p => p.socketId !== socket.id);
        room.roundActive = false;
        room.currentAnswer = null;
        await room.save();
        io.to(room.roomCode).emit('room_update', {
          roomCode: room.roomCode,
          players: serializePlayers(room.players),
          status: room.status,
        });
      }
    } catch (err) {
      console.error('[DISCONNECT ERROR]', err.message);
    }
  });
};

module.exports = handleSocket;
