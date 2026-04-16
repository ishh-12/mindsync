const Room = require("../models/Room");
const LeaderboardEntry = require("../models/LeaderboardEntry");
const { buildAIRoundOverlay } = require("../engine/aiEngine");
const { QUESTION_POOL, LEVEL_STAGES, TOTAL_LEVELS } = require("../data/chaosQuestionBank");
const { getPlayer, requireHost, requirePlayer, requireRole } = require("../utils/auth");
const { verifyPlayerToken } = require("../utils/playerAuth");

const timeoutMap = {};
const introTimeoutMap = {};
const readinessMap = {};
const roundTimingMap = {};
const roomLocks = new Map();
const globallyUsedQuestionIds = new Set();
const MAX_SPEED_BONUS = 8;

const correctRoasts = [
  "Do not get too confident. The next round is already loading your downfall.",
  "You survived, but the game is quietly planning revenge.",
  "Lucky. Very lucky. Even your confidence looked surprised.",
  "You accidentally cooked. Try repeating that under pressure.",
  "Tiny brainwave detected. Respect.",
  "THAT WAS CORRECT 🎯",
  "You got this one right… but let's see next round 😏",
  "Wow, you actually read the clue correctly! 🤯",
  "EXPOSED = you know yourself better than we thought 🤔",
  "Correct! But your next guess? Already wrong 💀",
  "THIS IS YOUR DAILY LIFE BTW - you nailed this one 😂",
  "Right answer! Your self-awareness level: 📈",
  "YOU KNEW THIS - and you picked it. Respect 🙏",
  "Accurate! But stay humble, chaos is loading… 👀",
  "EXPOSED your good decision-making skills there 💡",
];

const wrongRoasts = [
  "Engineering kar rahe ho ya guessing challenge?",
  "Even Google would be disappointed right now.",
  "You knew this. Ego said no.",
  "Overconfidence just body-slammed your score.",
  "Daily life exposed. Stop lying to yourself.",
  "WRONG 💀 - That was literally you yesterday though",
  "You LIED about knowing yourself 😭",
  "This IS your daily life and you still got it wrong 😂",
  "EXPOSED - you have no idea who you are 🤡",
  "That was the obvious choice… and you missed it 💀",
  "Your instinct said otherwise but look where it landed 🤡",
  "WRONG - even your mom would know this 😏",
  "You really thought that was it? 💀",
  "THIS IS EMBARRASSING - that's literally you every day",
  "BRO 😭 You were literally describing yourself and chose wrong",
];

const timeoutRoasts = [
  "Time up. Your decision-making went on tea break.",
  "Pressure arrived and the brain switched to airplane mode.",
  "You stared at chaos and chaos stared back.",
  "The clock won that round, not you.",
  "TIMEOUT 😭 - Indecision paralyzed you again",
  "Time flew. Your confidence didn't catch up in time 💀",
  "You froze. Brain on temporary pause 🤖",
  "Analysis paralysis strikes again 📊",
  "TIMEOUT = your overthinking defeated you 🤡",
];

const betrayalRoasts = [
  "Betrayal mode: you were correct and the game still chose violence. 💀",
  "You read it right, then chaos flipped the table anyway. 🤡",
  "Signal betrayal 🔥 - You knew, chaos disagreed",
  "CHAOS BETRAYAL - your instinct was RIGHT but the answer wasn't 😭",
];

const mandatoryAfterAnswerRoasts = [
  "😂 BRO THIS IS YOUR LIFE",
  "💀 EXPOSED",
  "😭 YOU KNEW THIS",
  "🔥 WHY DID YOU DO THAT",
];

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const getQuestionById = (id) => QUESTION_POOL.find((question) => question.id === id);

const chooseTargetPlayer = (room) => {
  const validPlayers = room.players.filter(Boolean);
  if (!validPlayers.length) return null;
  const index = Math.floor(Math.random() * validPlayers.length);
  return validPlayers[index]?.name || null;
};

const buildQuestionSet = () => {
  let availableQuestions = QUESTION_POOL.filter(
    (question) => !globallyUsedQuestionIds.has(question.id)
  );

  if (availableQuestions.length < TOTAL_LEVELS) {
    globallyUsedQuestionIds.clear();
    availableQuestions = [...QUESTION_POOL];
  }

  const selectedIds = [];
  const pool = [...availableQuestions];

  while (selectedIds.length < TOTAL_LEVELS && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    const [question] = pool.splice(index, 1);
    selectedIds.push(question.id);
    globallyUsedQuestionIds.add(question.id);
  }

  return selectedIds;
};

const getRoomQuestion = (room, levelNumber = room.level || 1) => {
  const questionId = room.assignedQuestionIds?.[(levelNumber || 1) - 1];
  return getQuestionById(questionId);
};

const fakeDangerByActual = { LOW: "HIGH", MEDIUM: "LOW", HIGH: "LOW" };

const hydrateLevel = (room, levelNumber = room.level || 1) => {
  const question = getRoomQuestion(room, levelNumber);
  const stage = LEVEL_STAGES[(levelNumber || 1) - 1];

  if (!question || !stage) return null;

  return {
    ...question,
    duration: stage.duration,
    corrupt: stage.corrupt,
    silenced: stage.silenced,
    stageName: stage.stageName,
  };
};

const serializePlayers = (players = []) =>
  players.map((player) => ({
    name: player.name,
    role: player.role,
    isHost: Boolean(player.isHost),
  }));

const buildLevelPayload = (room, player, level) => {
  const aiOverlay = buildAIRoundOverlay(level, room);
  const effectiveOperatorNote =
    level.corrupt || level.silenced
      ? aiOverlay.operatorNote
      : level.operatorNote || level.operatorData?.description || aiOverlay.operatorNote;

  return {
    role: player.role,
    level: room.level,
    totalLevels: TOTAL_LEVELS,
    stageName: level.stageName,
    name: level.name,
    subtitle: level.subtitle,
    operatorData: {
      ...level.operatorData,
      danger: level.corrupt
        ? fakeDangerByActual[level.operatorData.danger] || "MEDIUM"
        : level.operatorData.danger,
    },
    actualOperatorData: level.operatorData,
    options: level.options,
    clue: level.clue,
    analystBrief:
      player.role === "analyst"
        ? level.analystBrief || aiOverlay.analystBrief
        : level.analystBrief,
    operatorNote:
      player.role === "operator"
        ? effectiveOperatorNote
        : aiOverlay.operatorNote,
    personalityTag: level.personalityTag || null,
    hint: aiOverlay.hint,
    aiStatus: aiOverlay.systemLine,
    aiInsight: player.role === "operator" ? aiOverlay.operatorInsight : aiOverlay.analystInsight,
    corrupt: level.corrupt,
    silenced: level.silenced,
    duration: level.duration,
  };
};

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

const clearRoundTiming = (code) => {
  delete roundTimingMap[code];
};

const computeSpeedBonus = (durationSeconds, startedAtMs) => {
  if (!durationSeconds || !startedAtMs) {
    return { speedBonus: 0, answeredInSec: null };
  }

  const durationMs = Math.max(1, durationSeconds * 1000);
  const elapsedMs = Math.max(0, Date.now() - startedAtMs);
  const remainingRatio = Math.max(0, Math.min(1, (durationMs - elapsedMs) / durationMs));
  const speedBonus = Math.max(0, Math.round(remainingRatio * MAX_SPEED_BONUS));
  const answeredInSec = Number((elapsedMs / 1000).toFixed(1));

  return { speedBonus, answeredInSec };
};

const withRoomLock = async (code, work) => {
  const previous = roomLocks.get(code) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => {
    release = resolve;
  });

  roomLocks.set(code, previous.then(() => current));
  await previous;

  try {
    return await work();
  } finally {
    release();
    if (roomLocks.get(code) === current) {
      roomLocks.delete(code);
    }
  }
};

const getLeaderboardSnapshot = async () =>
  LeaderboardEntry.find()
    .sort({ bestScore: -1, totalScore: -1, gamesPlayed: -1, name: 1 })
    .limit(10)
    .lean();

const finishGame = async (io, room) => {
  clearRoundTiming(room.roomCode);
  room.status = "finished";
  room.currentAnswer = null;
  room.roundActive = false;
  await room.save();

  if (room.score > 0) {
    const teamName = room.players.map((player) => player.name).sort().join(" + ");
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

  const level = hydrateLevel(room);
  if (!level || room.level > TOTAL_LEVELS) {
    await finishGame(io, room);
    return;
  }

  room.status = "briefing";
  room.currentAnswer = null;
  room.roundActive = false;
  room.currentTargetName = null;
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

const createRoast = (isCorrect, betrayalTriggered = false) => {
  const mandatoryLine = pickRandom(mandatoryAfterAnswerRoasts);

  if (betrayalTriggered) {
    return `${pickRandom(betrayalRoasts)} ${mandatoryLine}`;
  }

  return `${isCorrect ? pickRandom(correctRoasts) : pickRandom(wrongRoasts)} ${mandatoryLine}`;
};

const handleSocket = (io, socket) => {
  socket.on("join_room", async ({ roomCode, name, token }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const playerName = name?.trim();

      if (!code || !playerName) {
        socket.emit("error", "roomCode and name are required");
        return;
      }

      const verification = verifyPlayerToken(token);
      if (!verification.valid) {
        socket.emit("error", `Unauthorized: ${verification.reason}`);
        return;
      }

      const tokenName = verification.payload.name?.trim();
      const tokenRoomCode = verification.payload.roomCode?.trim()?.toUpperCase();
      if (tokenRoomCode !== code || tokenName?.toLowerCase() !== playerName.toLowerCase()) {
        socket.emit("error", "Unauthorized: token does not match player");
        return;
      }

      await withRoomLock(code, async () => {
        const room = await Room.findOne({ roomCode: code });
        if (!room) {
          socket.emit("error", "Room not found");
          return;
        }

        const existingBySocket = room.players.find((player) => player.socketId === socket.id);
        if (existingBySocket) {
          socket.join(code);
          socket.emit("role_assigned", { role: existingBySocket.role });
          io.to(code).emit("room_update", {
            roomCode: code,
            players: serializePlayers(room.players),
            status: room.status,
          });
          return;
        }

        const existingByName = room.players.find(
          (player) => player.name?.toLowerCase() === playerName.toLowerCase()
        );
        if (existingByName) {
          existingByName.socketId = socket.id;
          await room.save();
          socket.join(code);
          socket.emit("role_assigned", { role: existingByName.role });
          io.to(code).emit("room_update", {
            roomCode: code,
            players: serializePlayers(room.players),
            status: room.status,
          });
          return;
        }

        if (room.players.length >= 2) {
          socket.emit("error", "Room is full");
          return;
        }

        const role = room.players.length === 0 ? "analyst" : "operator";
        room.players.push({
          socketId: socket.id,
          name: playerName,
          role,
          isHost: room.players.length === 0,
        });
        await room.save();

        socket.join(code);
        socket.emit("role_assigned", { role });
        io.to(code).emit("room_update", {
          roomCode: code,
          players: serializePlayers(room.players),
          status: room.status,
        });

        if (room.players.length === 2) {
          io.to(code).emit("ready_to_start", { roomCode: code });
        }
      });
    } catch (err) {
      console.error("[JOIN ERROR]", err.message);
      socket.emit("error", "Error joining room");
    }
  });

  socket.on("start_game", async ({ roomCode }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: code });

      if (!room) return socket.emit("error", "Room not found");
      if (room.players.length < 2) return socket.emit("error", "Need 2 players");

      const player = getPlayer(room, socket);
      if (!requireHost(player, socket)) return;

      room.status = "playing";
      room.level = 1;
      room.score = 0;
      room.currentAnswer = null;
      room.trustScore = 0;
      room.assignedQuestionIds = buildQuestionSet();
      room.betrayalLevel = Math.random() < 0.3 ? Math.ceil(Math.random() * TOTAL_LEVELS) : null;
      room.lastChoices = [];
      room.roundActive = false;
      await room.save();

      io.to(code).emit("game_started", {
        roomCode: code,
        players: serializePlayers(room.players),
      });

      scheduleNextLevelIntro(io, code, 700);
    } catch (err) {
      console.error("[START GAME ERROR]", err.message);
      socket.emit("error", "Error starting game");
    }
  });

  socket.on("start_level", async ({ roomCode }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: code });

      if (!room) return socket.emit("error", "Room not found");
      if (room.players.length < 2) return socket.emit("error", "Need 2 players");

      const player = getPlayer(room, socket);
      if (!requireHost(player, socket)) return;

      await emitLevelIntro(io, code);
    } catch (err) {
      console.error("[START LEVEL ERROR]", err.message);
      socket.emit("error", "Error starting level");
    }
  });

  socket.on("ready_for_level", async ({ roomCode, level }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: code });

      if (!room) return socket.emit("error", "Room not found");
      if (room.players.length < 2) return socket.emit("error", "Need 2 players");

      const player = getPlayer(room, socket);
      if (!requirePlayer(player, socket)) return;

      if ((room.level || 1) !== Number(level)) return;
      if (room.roundActive) return;

      if (!readinessMap[code]) readinessMap[code] = new Set();
      readinessMap[code].add(socket.id);

      const activeSocketIds = room.players
        .map((currentPlayer) => currentPlayer.socketId)
        .filter(Boolean);
      const everyoneReady =
        activeSocketIds.length > 0 &&
        activeSocketIds.every((socketId) => readinessMap[code].has(socketId));

      if (!everyoneReady) {
        io.to(code).emit("level_sync", {
          level: room.level,
          readyCount: readinessMap[code].size,
          playerCount: activeSocketIds.length,
        });
        return;
      }

      const currentLevel = hydrateLevel(room);
      if (!currentLevel) {
        await finishGame(io, room);
        return;
      }

      room.currentTargetName = null;
      room.currentAnswer = currentLevel.answer;
      room.status = "playing";
      room.roundActive = true;
      await room.save();

      room.players.forEach((currentPlayer) => {
        io.to(currentPlayer.socketId).emit(
          "level_data",
          buildLevelPayload(room, currentPlayer, currentLevel)
        );
      });

      io.to(code).emit("timer_start", { level: room.level, time: currentLevel.duration });
      roundTimingMap[code] = {
        startedAtMs: Date.now(),
        durationSeconds: currentLevel.duration,
      };
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
          clearRoundTiming(code);

          io.to(code).emit("time_up", {
            message: "TIME UP",
            score: updatedRoom.score,
            trustScore: updatedRoom.trustScore || 0,
            level: updatedRoom.level,
            completedLevel,
            points: -5,
            correct: false,
            roast: pickRandom(timeoutRoasts),
            gameOver: completedLevel >= TOTAL_LEVELS,
          });

          if (completedLevel >= TOTAL_LEVELS) {
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

  socket.on("send_signal", async ({ roomCode, signal }) => {
    const code = roomCode?.trim()?.toUpperCase();
    const sig = signal?.trim()?.toUpperCase();
    if (!code) return;

    try {
      const room = await Room.findOne({ roomCode: code });
      if (!room) return socket.emit("error", "Room not found");

      const player = getPlayer(room, socket);
      if (!requireRole(player, "operator", socket)) return;

      const level = hydrateLevel(room);
      if (!level) return;
      if (level.silenced) return socket.emit("error", "Signals disabled in this level");

      const allowedSignals = ["STATIC", "SIGNAL", "BREACH"];
      if (!allowedSignals.includes(sig)) {
        return socket.emit("error", "Invalid signal");
      }

      const analystPlayer = room.players.find((currentPlayer) => currentPlayer.role === "analyst");
      if (analystPlayer) {
        io.to(analystPlayer.socketId).emit("receive_signal", sig);
      }
    } catch (err) {
      console.error("[SEND SIGNAL ERROR]", err.message);
    }
  });

  socket.on("select_option", async ({ roomCode, option }) => {
    try {
      const code = roomCode?.trim()?.toUpperCase();
      const room = await Room.findOne({ roomCode: code });

      if (!room || room.currentAnswer == null) return;

      const player = getPlayer(room, socket);
      if (!requireRole(player, "analyst", socket)) return;

      clearRoomTimeout(code);
      clearRoundTiming(code);

      const completedLevel = room.level || 1;
      const currentLevel = hydrateLevel(room, completedLevel);
      const selectedCorrectly = String(option).trim() === String(room.currentAnswer).trim();
      const betrayalTriggered = Boolean(
        room.betrayalLevel &&
          room.betrayalLevel === completedLevel &&
          selectedCorrectly
      );
      const isCorrect = betrayalTriggered ? false : selectedCorrectly;
      const { speedBonus, answeredInSec } = computeSpeedBonus(
        roundTimingMap[code]?.durationSeconds,
        roundTimingMap[code]?.startedAtMs
      );

      let points = isCorrect ? 10 : -5;
      if (isCorrect && completedLevel === 5) points += 15;
      if (isCorrect && completedLevel === 6) points += 20;
      if (isCorrect) points += speedBonus;

      room.score = (room.score || 0) + points;
      room.trustScore = (room.trustScore || 0) + (isCorrect ? 1 : -1);
      room.currentAnswer = null;
      room.currentTargetName = null;
      room.roundActive = false;
      room.level = completedLevel + 1;
      await room.save();
      clearRoundTiming(code);

      io.to(code).emit("result", {
        correct: isCorrect,
        completedLevel,
        points,
        score: room.score,
        level: room.level,
        trustScore: room.trustScore,
        selectedOption: option,
        levelName: currentLevel?.name,
        personalityTag: currentLevel?.personalityTag || null,
        roast: createRoast(isCorrect, betrayalTriggered),
        speedBonus: isCorrect ? speedBonus : 0,
        answeredInSec,
        betrayalTriggered,
        roleHint: betrayalTriggered
          ? "Chaos overruled logic this round."
          : isCorrect
            ? "You read the clue right."
            : "Wrong read. The clue won this round.",
        gameOver: completedLevel >= TOTAL_LEVELS,
      });

      if (completedLevel >= TOTAL_LEVELS) {
        await finishGame(io, room);
        return;
      }

      scheduleNextLevelIntro(io, code);
    } catch (err) {
      console.error("[SELECT OPTION ERROR]", err.message);
      socket.emit("error", "Error selecting option");
    }
  });

  socket.on("disconnect", async () => {
    try {
      const rooms = await Room.find({ "players.socketId": socket.id });
      for (const room of rooms) {
        clearRoomTimeout(room.roomCode);
        clearIntroTimeout(room.roomCode);
        clearReadiness(room.roomCode);
        clearRoundTiming(room.roomCode);
        room.players = room.players.filter((player) => player.socketId !== socket.id);
        room.roundActive = false;
        room.currentAnswer = null;
        await room.save();
        io.to(room.roomCode).emit("room_update", {
          roomCode: room.roomCode,
          players: serializePlayers(room.players),
          status: room.status,
        });
      }
    } catch (err) {
      console.error("[DISCONNECT ERROR]", err.message);
    }
  });
};

module.exports = handleSocket;
