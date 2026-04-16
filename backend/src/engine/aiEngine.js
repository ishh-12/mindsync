const personalityReads = {
  skeptical: {
    analyst: "NEXUS read: trust is cheap here. Slow down and verify before you commit.",
    operator: "NEXUS read: this target smells fake. Guide the Analyst toward checking first.",
  },
  composed: {
    analyst: "NEXUS read: pressure is bait. The smart move usually sounds less heroic.",
    operator: "NEXUS read: send a balanced signal. Panic is exactly what the trap wants.",
  },
  patient: {
    analyst: "NEXUS read: impulse loses this round. Calm usually beats embarrassment.",
    operator: "NEXUS read: push patience, not overreaction.",
  },
  responsible: {
    analyst: "NEXUS read: action matters more than emotional drama here.",
    operator: "NEXUS read: signal immediate effort. Delay is a losing move.",
  },
  loyal: {
    analyst: "NEXUS read: fear will look tempting, but character is the real test.",
    operator: "NEXUS read: this cue rewards loyalty over survival panic.",
  },
  delusional: {
    analyst: "NEXUS read: optimism is lying again. Pick the brutally true outcome.",
    operator: "NEXUS read: confidence is fake here. Signal the most realistic collapse.",
  },
  reliable: {
    analyst: "NEXUS read: one person carrying the whole mess is the usual pattern.",
    operator: "NEXUS read: direct the Analyst toward the burden-bearer.",
  },
  distracted: {
    analyst: "NEXUS read: discipline is losing to distraction in real time.",
    operator: "NEXUS read: signal the avoidant spiral, not the ideal plan.",
  },
  dramatic: {
    analyst: "NEXUS read: emotion is louder than truth here. Read the behavior, not the speech.",
    operator: "NEXUS read: the cue points to overacting and bluff energy.",
  },
  predictive: {
    analyst: "NEXUS read: friendship patterns beat literal words in this round.",
    operator: "NEXUS read: signal the move shaped by lived experience, not logic.",
  },
  realist: {
    analyst: "NEXUS read: group-chat hope is fake. Pick what reality usually leaves behind.",
    operator: "NEXUS read: guide the Analyst toward the uncomfortable middle truth.",
  },
  drained: {
    analyst: "NEXUS read: energy collapse is the hidden force in this round.",
    operator: "NEXUS read: this ends with passivity. Signal the dead-battery outcome.",
  },
  overthinker: {
    analyst: "NEXUS read: the mind spiral is already loading. Choose emotional realism.",
    operator: "NEXUS read: signal the overthinking path, not the mature fantasy.",
  },
  "time-blind": {
    analyst: "NEXUS read: time estimates are fiction. Choose the delayed reality.",
    operator: "NEXUS read: their ETA is propaganda. Signal the painful truth.",
  },
  chaotic: {
    analyst: "NEXUS read: escalation is inevitable. Expect the situation to get worse, not better.",
    operator: "NEXUS read: signal maximum chaos. One step becomes thirty immediately.",
  },
  unreliable: {
    analyst: "NEXUS read: promises are weaker than the recovery mission you know is coming.",
    operator: "NEXUS read: guide the Analyst toward the option that requires chasing people down.",
  },
};

const systemDirectives = {
  stable: "NEXUS status: stable. Use both roles properly and punish overconfidence.",
  corrupt: "NEXUS status: corrupted. Some operator intel may be misleading this round.",
  silenced: "NEXUS status: blackout. Comms are jammed, so behavior-reading matters more than signals.",
  betrayal: "NEXUS status: betrayal risk elevated. Even correct instincts may get punished.",
};

const buildAIRoundOverlay = (level, room) => {
  const personality = personalityReads[level.personalityTag] || {};
  const isBetrayalRound = Boolean(room?.betrayalLevel && room.betrayalLevel === room?.level);
  const mode = level.silenced ? "silenced" : level.corrupt ? "corrupt" : isBetrayalRound ? "betrayal" : "stable";

  const analystInsight =
    personality.analyst || "Trust the signal, not the panic.";
  const operatorInsight =
    personality.operator || "One signal only. Keep it clean.";

  return {
    mode,
    systemLine: systemDirectives[mode],
    analystInsight,
    operatorInsight,
    analystBrief:
      mode === "silenced"
        ? "No signal this round. Pick the option that feels the least wrong."
        : "Listen to the signal, then choose the answer that fits.",
    operatorNote:
      mode === "corrupt"
        ? "The panel may lie. Send a single, honest signal."
        : mode === "silenced"
          ? "No signal can be sent. Stay quiet and wait."
          : "Send one clear signal. No big speeches.",
    hint:
      mode === "corrupt"
        ? "Signal carefully. The screen may be lying."
        : mode === "silenced"
          ? "No signal this round. The clue is all you have."
          : mode === "betrayal"
            ? "Even the right move may still get punished."
            : "Use the signal, then pick the most real answer.",
  };
};

const applyAIDeception = (level, roomLevel = 1, room = {}) => {
  const overlay = buildAIRoundOverlay(level, room);
  const mode = overlay.mode;
  const clue = level.analystData?.hint || level.analystData?.scene || "Trust the signal, not the noise.";
  const defaultAnalystBrief = mode === "silenced"
    ? "No signal this round. Pick the option that feels the least wrong."
    : overlay.analystBrief;
  const analystBrief = level.analystData?.description || defaultAnalystBrief;

  let operatorNote = level.operatorData?.description || overlay.operatorNote || "Send one clear signal. No big speeches.";
  let fakeDanger = null;
  let fakeValue = null;
  let isClueCorrupted = false;

  if (level.corrupt) {
    isClueCorrupted = true;
    fakeValue = level.operatorData?.fakeValue;
    if (fakeValue) {
      operatorNote = `NEXUS says: '${fakeValue}' is the only safe option. Also, this is definitely not a prank.`;
    } else {
      operatorNote = `NEXUS says: follow the weird screen. Then immediately question the weird screen.`;
    }

    if (level.operatorData?.danger) {
      fakeDanger = level.operatorData.danger === "HIGH" ? "LOW" : "HIGH";
    }
  }

  return {
    clue,
    analystBrief,
    operatorNote,
    isClueCorrupted,
    fakeDanger,
    fakeValue,
  };
};

module.exports = {
  buildAIRoundOverlay,
  applyAIDeception,
};
