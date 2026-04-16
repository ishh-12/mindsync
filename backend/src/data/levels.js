const LEVELS = [
  {
    id: 1,
    name: 'THREAT LEVEL',
    subtitle: 'Identify the exact threat number',
    timeLimit: 60,
    analyst: {
      hint: 'Read the signal and choose carefully.',
      options: ['18', '19', '20', '21'],
      answer: '20',
      description: 'Use the available clues and signal.'
    },
    operator: {
      value: '20',
      description: 'You see the exact threat number. Wait for Analyst to tell you the answer.'
    },
    briefing: {
      situation: '🚨 ALERT: A threat has been detected! You must identify the exact threat level.',
      analystMission: 'You can see the ANSWER. Tell Operator the exact number by typing it in the hint box.',
      operatorMission: 'You see a THREAT NUMBER on your screen. Wait for Analyst to send you the hint, then pick the matching answer.',
      tip: 'Communication is key! Analyst must type the exact number for Operator to choose correctly.'
    }
  },
  {
    id: 2,
    name: 'EVACUATION',
    subtitle: 'Guide survivors to safety',
    timeLimit: 60,
    analyst: {
      hint: 'Use the signal and the situation to infer the safest option.',
      options: ['BASEMENT', 'ROOF', 'TUNNEL', 'GARAGE'],
      answer: 'ROOF',
      description: 'Trust the signal, not your panic.'
    },
    operator: {
      value: 'ROOF',
      description: 'You see the evacuation destination. Analyst will send you a hint.'
    },
    briefing: {
      situation: '🦠 INFECTION SPREADING: Survivors must evacuate immediately!',
      analystMission: 'You know the SAFE LOCATION. Type it in the hint so Operator knows where to send people.',
      operatorMission: 'Your screen shows the evacuation point. Wait for Analyst\'s hint, then confirm that location.',
      tip: 'LOW danger = safest option. ROOF is shown with LOW danger - that\'s your answer.'
    }
  },
  {
    id: 3,
    name: 'SYMPTOM CHECK',
    subtitle: 'Identify the infected symptom',
    timeLimit: 60,
    analyst: {
      hint: 'Higher danger means a more severe symptom.',
      options: ['FEVER', 'LIMPING', 'FOAMING MOUTH', 'BLEEDING EYES'],
      answer: 'FOAMING MOUTH',
      description: 'Pick based on the signal and severity.'
    },
    operator: {
      value: 'FOAMING MOUTH',
      description: 'You see the symptom. Analyst will guide you.'
    },
    briefing: {
      situation: '💉 MEDICAL EMERGENCY: Someone is showing zombie symptoms!',
      analystMission: 'You see the symptom. Send a hint describing which one is the most SEVERE.',
      operatorMission: 'Your screen shows 4 symptoms. Wait for Analyst\'s hint about which is the worst.',
      tip: 'HIGH danger = pick the most extreme/serious option shown.'
    }
  },
  {
    id: 4,
    name: 'BIOHAZARD',
    subtitle: '⚠️ NEXUS AI CORRUPTION ACTIVE',
    timeLimit: 60,
    analyst: {
      hint: 'Warning: this round may contain false information.',
      options: ['🧟', '☣️', '💉', '🔥'],
      answer: '☣️',
      description: 'Something in the system is lying this round.',
      warning: 'NEXUS AI CORRUPTION: Your hint may be manipulated!'
    },
    operator: {
      value: '☣️',
      fakeValue: '🧟',
      description: '⚠️ NEXUS may be showing fake data. Trust Analyst\'s hint!',
    },
    briefing: {
      situation: '☣️ WARNING: The villain AI NEXUS is trying to manipulate your systems!',
      analystMission: 'You see the CORRECT answer but NEXUS is now on prank mode. Warn Operator with everything you have!',
      operatorMission: 'Your screen may show FAKE DATA. NEXUS also thinks this is a zombie party. Trust the Analyst, not the meme.',
      tip: 'If Analyst sends a warning about NEXUS, their hint is more reliable than your screen!',
    }
  },

  {
  id: 5,
  name: 'BLACKOUT',
  subtitle: '⛔ ALL COMMUNICATIONS JAMMED',
  timeLimit: 60,

  analyst: {
    hint: 'No reliable signal is available this round.',
    options: ['SEAL DOOR', 'RUN', 'HIDE', 'FIGHT'],
    answer: 'HIDE',
    description: 'Trust instinct when communication fails.'
  },

  operator: {
    value: '???',
    description: 'All systems offline. No signal transmission possible.'
  },

  briefing: {
    situation: '⛔ BLACKOUT: NEXUS has shut down all communication channels.',
    analystMission: 'You cannot send or receive signals. You are isolated.',
    operatorMission: 'You have no guidance. No system input. No communication.',
    tip: 'When information is gone, survival depends on instinct... or luck.'
  }
  },
  
  {
    id: 6,
    name: 'FINAL MISSION',
    subtitle: 'Last chance - 8 seconds!',
    timeLimit: 60,
    analyst: {
      hint: 'Maximum danger means the most extreme response.',
      options: ['EVACUATE', 'HIDE', 'DETONATE BUNKER', 'SEND SOS'],
      answer: 'DETONATE BUNKER',
      description: 'Use the signal and choose the highest-stakes action.'
    },
    operator: {
      value: 'DETONATE BUNKER',
      description: 'FINAL ORDER received. Analyst will send the answer!'
    },
    briefing: {
      situation: '🔥 LAST SURVIVOR: This is it. Execute the final order perfectly.',
      analystMission: '8 SECONDS! Send the answer NOW! It\'s the most EXTREME option.',
      operatorMission: 'FINAL MISSION! Time is almost out. Pick the most drastic action!',
      tip: 'When time runs out and stakes are MAXIMUM, only the most extreme option works.'
    }
  }
];

module.exports = { LEVELS };
