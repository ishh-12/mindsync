const LEVELS = [
  {
    id: 1,
    name: 'THREAT LEVEL',
    subtitle: 'Identify the exact threat number',
    timeLimit: 30,
    analyst: {
      hint: 'The threat number is EXACTLY what you see. Your job is to tell Operator the exact number.',
      options: ['18', '19', '20', '21'],
      answer: '20',
      description: 'The correct answer is 20'
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
    timeLimit: 30,
    analyst: {
      hint: 'The safest location is ROOF. LOW danger means the safest option shown.',
      options: ['BASEMENT', 'ROOF', 'TUNNEL', 'GARAGE'],
      answer: 'ROOF',
      description: 'The correct answer is ROOF'
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
    timeLimit: 25,
    analyst: {
      hint: 'HIGH danger = the MOST SEVERE symptom. Look for "FOAMING MOUTH" - it\'s the worst one.',
      options: ['FEVER', 'LIMPING', 'FOAMING MOUTH', 'BLEEDING EYES'],
      answer: 'FOAMING MOUTH',
      description: 'The correct answer is FOAMING MOUTH'
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
    timeLimit: 25,
    analyst: {
      hint: '⚠️ NEXUS is showing you WRONG INFO! Look at the WARNING. The real danger is HIGH, not LOW!',
      options: ['🧟', '☣️', '💉', '🔥'],
      answer: '☣️',
      description: 'The correct answer is ☣️ (but NEXUS is lying!)',
      warning: 'NEXUS AI CORRUPTION: Your hint may be manipulated!'
    },
    operator: {
      value: '☣️',
      fakeValue: '🧟',
      description: '⚠️ NEXUS may be showing fake data. Trust Analyst\'s hint!'
    },
    briefing: {
      situation: '☣️ WARNING: The villain AI NEXUS is trying to manipulate your systems!',
      analystMission: 'You see the CORRECT answer but NEXUS might corrupt your hint. Try your best to warn Operator!',
      operatorMission: 'Your screen may show FAKE DATA. Trust Analyst\'s text hint over what you see!',
      tip: 'If Analyst sends a warning about NEXUS, their hint is more reliable than your screen!'
    }
  },
  {
    id: 5,
    name: 'BLACKOUT',
    subtitle: '⛔ ALL COMMUNICATIONS JAMMED',
    timeLimit: 20,
    analyst: {
      hint: '⛔ I CAN\'T REACH YOU! No signals work. Trust your instincts!',
      options: ['SEAL DOOR', 'RUN', 'HIDE', 'FIGHT'],
      answer: 'HIDE',
      description: 'The correct answer is HIDE'
    },
    operator: {
      value: '???',
      description: 'Communications down! Analyst can\'t help. Decide alone!'
    },
    briefing: {
      situation: '⛔ BLACKOUT: NEXUS has jammed all communications!',
      analystMission: 'You can\'t send any signals! Try typing something but Operator is on their own.',
      operatorMission: 'NO ONE CAN HELP YOU! Your screen shows nothing useful. Trust your survival instincts.',
      tip: 'In the dark with no intel, the smartest move is usually to HIDE and wait.'
    }
  },
  {
    id: 6,
    name: 'FINAL MISSION',
    subtitle: 'Last chance - 8 seconds!',
    timeLimit: 8,
    analyst: {
      hint: 'It\'s BREACH! MAXIMUM DANGER! Only one option matches - DETONATE BUNKER!',
      options: ['EVACUATE', 'HIDE', 'DETONATE BUNKER', 'SEND SOS'],
      answer: 'DETONATE BUNKER',
      description: 'The correct answer is DETONATE BUNKER'
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
