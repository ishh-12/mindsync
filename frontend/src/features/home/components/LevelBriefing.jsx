import React, { useState } from 'react';

const levelBriefings = {
  1: {
    title: 'LEVEL 1 — WARMUP',
    subtitle: 'THREAT ASSESSMENT',
    color: '#ff0033',
    cards: [
      {
        icon: '📡',
        role: 'SITUATION',
        heading: 'THREAT DETECTED',
        text: 'An unknown threat has been detected in the facility. Command needs to confirm the exact threat level before response teams move in.',
      },
      {
        icon: '🎛️',
        role: 'OPERATOR',
        heading: 'YOUR MISSION',
        text: 'You can see the threat value on your screen along with the danger level. Send the correct signal to your Analyst so they know how serious it is.',
      },
      {
        icon: '🧠',
        role: 'ANALYST',
        heading: 'YOUR MISSION',
        text: 'You receive the signal from Operator. Use it to pick the correct threat level from 4 options. HIGH signal = pick the highest value.',
      },
      {
        icon: '⚡',
        role: 'SIGNAL GUIDE',
        heading: 'THE 3 SIGNALS',
        signals: [
          { name: 'STATIC', color: '#0066ff', meaning: 'LOW danger → pick the lowest value' },
          { name: 'SIGNAL', color: '#ffcc00', meaning: 'MEDIUM danger → pick the middle value' },
          { name: 'BREACH', color: '#ff0033', meaning: 'HIGH danger → pick the highest value' },
        ],
      },
    ],
  },
  2: {
    title: 'LEVEL 2 — INFECTION ZONE',
    subtitle: 'EVACUATION PROTOCOL',
    color: '#0066ff',
    cards: [
      {
        icon: '🧟',
        role: 'SITUATION',
        heading: 'OUTBREAK SPREADING',
        text: 'The infection has breached containment. Survivors must evacuate immediately. Operator knows the safe exit. Analyst must choose correctly or they die.',
      },
      {
        icon: '🎛️',
        role: 'OPERATOR',
        heading: 'YOUR MISSION',
        text: 'You see the evacuation destination and the danger level. Send the right signal to guide your Analyst to the safe zone. Every second counts.',
      },
      {
        icon: '🧠',
        role: 'ANALYST',
        heading: 'YOUR MISSION',
        text: 'Use the signal from Operator to pick the correct evacuation point. One wrong move and you\'re infected. Trust the signal.',
      },
      {
        icon: '⚡',
        role: 'SIGNAL GUIDE',
        heading: 'THE 3 SIGNALS',
        signals: [
          { name: 'STATIC', color: '#0066ff', meaning: 'LOW danger → safe route, calm choice' },
          { name: 'SIGNAL', color: '#ffcc00', meaning: 'MEDIUM danger → risky but possible' },
          { name: 'BREACH', color: '#ff0033', meaning: 'HIGH danger → extreme urgency' },
        ],
      },
    ],
  },
  3: {
    title: 'LEVEL 3 — BIOHAZARD',
    subtitle: 'TRUST NO ONE',
    color: '#ffcc00',
    cards: [
      {
        icon: '☣️',
        role: 'SITUATION',
        heading: 'N.E.X.U.S. WILL MANIPULATE',
        text: 'The AI villain N.E.X.U.S. will try to manipulate what you see. Would you trust it — or your partner? Sometimes what it shows may be true. Sometimes it won\'t be.',
      },
      {
        icon: '🎛️',
        role: 'OPERATOR',
        heading: 'STAY SHARP',
        text: 'Your screen may show a different danger level than reality. N.E.X.U.S. is watching. Decide carefully — do you trust what you see, or override it based on instinct?',
        highlight: '⚠️ YOUR SCREEN MAY LIE',
        highlightColor: '#ffcc00',
      },
      {
        icon: '🧠',
        role: 'ANALYST',
        heading: 'YOUR MISSION',
        text: 'The signal from Operator is your only real clue. Trust it over anything else on your screen. N.E.X.U.S. wants you to doubt your partner.',
        highlight: 'TRUST YOUR PARTNER',
        highlightColor: '#ffcc00',
      },
      {
        icon: '⚡',
        role: 'SIGNAL GUIDE',
        heading: 'THE 3 SIGNALS',
        signals: [
          { name: 'STATIC', color: '#0066ff', meaning: 'LOW — but can you trust what you\'re seeing?' },
          { name: 'SIGNAL', color: '#ffcc00', meaning: 'MEDIUM — N.E.X.U.S. wants you confused' },
          { name: 'BREACH', color: '#ff0033', meaning: 'HIGH — override the lie if you must' },
        ],
      },
    ],
  },
  4: {
    title: 'LEVEL 4 — QUARANTINE ZONE',
    subtitle: 'IDENTIFY THE INFECTED',
    color: '#ff0033',
    cards: [
      {
        icon: '🩸',
        role: 'SITUATION',
        heading: 'INFECTION SPREADING',
        text: 'A survivor is showing zombie symptoms. Medical team needs to confirm the exact symptom to administer the right antidote. Wrong answer = everyone dies.',
      },
      {
        icon: '🎛️',
        role: 'OPERATOR',
        heading: 'YOUR MISSION',
        text: 'You can see the symptom and the danger level on your screen. Send the correct signal fast — the antidote window is closing.',
      },
      {
        icon: '🧠',
        role: 'ANALYST',
        heading: 'YOUR MISSION',
        text: 'Use the signal from Operator to identify the correct symptom from the list. The danger level tells you how severe it is. Pick fast before the infection spreads.',
      },
      {
        icon: '⚡',
        role: 'SIGNAL GUIDE',
        heading: 'THE 3 SIGNALS',
        signals: [
          { name: 'STATIC', color: '#0066ff', meaning: 'LOW — mild symptom, manageable' },
          { name: 'SIGNAL', color: '#ffcc00', meaning: 'MEDIUM — concerning, act soon' },
          { name: 'BREACH', color: '#ff0033', meaning: 'HIGH — critical symptom, act NOW' },
        ],
      },
    ],
  },
  5: {
    title: 'LEVEL 5 — BLACKOUT',
    subtitle: 'RADIO SILENCE',
    color: '#ffcc00',
    cards: [
      {
        icon: '🌑',
        role: 'SITUATION',
        heading: 'ALL COMMS JAMMED',
        text: 'N.E.X.U.S. has jammed all communication channels. No signals can be sent or received. You are completely on your own this round.',
      },
      {
        icon: '🎛️',
        role: 'OPERATOR',
        heading: 'YOU ARE BLIND',
        text: 'Your screen shows no data. You cannot send any signals this round. N.E.X.U.S. has silenced you entirely. Your partner must act alone.',
        highlight: '🚫 NO SIGNALS THIS ROUND',
        highlightColor: '#ffcc00',
      },
      {
        icon: '🧠',
        role: 'ANALYST',
        heading: 'USE YOUR INSTINCT',
        text: 'No signal will come. You must decide alone using nothing but your instincts. In a total blackout with zero intel — what is the smartest survival move?',
        highlight: 'YOU DECIDE ALONE',
        highlightColor: '#ffcc00',
      },
      {
        icon: '⚡',
        role: 'SIGNAL GUIDE',
        heading: 'COMMS JAMMED',
        signals: [
          { name: 'STATIC', color: '#33333388', meaning: 'BLOCKED — cannot be sent' },
          { name: 'SIGNAL', color: '#33333388', meaning: 'BLOCKED — cannot be sent' },
          { name: 'BREACH', color: '#33333388', meaning: 'BLOCKED — cannot be sent' },
        ],
      },
    ],
  },
  6: {
    title: 'LEVEL 6 — LAST SURVIVOR',
    subtitle: 'FINAL CALL',
    color: '#ff0033',
    cards: [
      {
        icon: '💥',
        role: 'SITUATION',
        heading: 'POINT OF NO RETURN',
        text: 'The facility is overrun. There is one last order from command. Execute it perfectly or humanity falls. No mistakes. This is the end.',
      },
      {
        icon: '🎛️',
        role: 'OPERATOR',
        heading: 'FINAL ORDER',
        text: 'You have the final order and the danger level on your screen. Send the correct signal immediately. Every second you waste costs lives.',
        highlight: 'SEND THE RIGHT SIGNAL — NOW',
        highlightColor: '#ff0033',
      },
      {
        icon: '🧠',
        role: 'ANALYST',
        heading: 'EXECUTE THE ORDER',
        text: 'BREACH means the highest stakes. Ignore your survival instinct. The mission comes first. You have 8 seconds. Pick the correct final action.',
        highlight: 'YOU HAVE 8 SECONDS',
        highlightColor: '#ff0033',
      },
      {
        icon: '⚡',
        role: 'SIGNAL GUIDE',
        heading: 'FINAL SIGNAL',
        signals: [
          { name: 'STATIC', color: '#0066ff', meaning: 'LOW — wrong call, don\'t send this' },
          { name: 'SIGNAL', color: '#ffcc00', meaning: 'MEDIUM — wrong call, don\'t send this' },
          { name: 'BREACH', color: '#ff0033', meaning: 'HIGH — THE ONLY RIGHT SIGNAL' },
        ],
      },
    ],
  },
};

function ComicCard({ card, isActive, color }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '2rem',
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.97)',
      transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: isActive ? 'auto' : 'none',
    }}>
      <div style={{
        width: '100%', maxWidth: '480px',
        background: '#010408',
        border: `1px solid ${color}44`,
        boxShadow: `0 0 40px ${color}11, inset 0 0 40px rgba(0,0,0,0.5)`,
        position: 'relative', overflow: 'hidden',
        padding: '2rem',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color, opacity: 0.8 }}/>
        {[{t:8,l:8},{t:8,r:8},{b:8,l:8},{b:8,r:8}].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', width: 6, height: 6, borderRadius: '50%',
            background: '#050812', border: `1px solid ${color}44`,
            top: pos.t, bottom: pos.b, left: pos.l, right: pos.r,
          }}/>
        ))}

        <div style={{
          fontFamily: 'Share Tech Mono', fontSize: '0.6rem',
          color, letterSpacing: '0.25em',
          border: `1px solid ${color}33`, display: 'inline-block',
          padding: '0.15rem 0.6rem', marginBottom: '1rem',
        }}>
          {card.role}
        </div>

        <div style={{ fontSize: '3rem', marginBottom: '0.75rem', lineHeight: 1 }}>{card.icon}</div>

        <div style={{
          fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 900,
          color, letterSpacing: '0.08em',
          textShadow: `0 0 20px ${color}66`,
          marginBottom: '1rem',
        }}>
          {card.heading}
        </div>

        {card.text && (
          <div style={{
            fontFamily: 'Share Tech Mono', fontSize: '0.75rem',
            color: '#4a7a5a', lineHeight: 1.75,
            marginBottom: card.highlight || card.signals ? '1.25rem' : 0,
          }}>
            {card.text}
          </div>
        )}

        {card.highlight && (
          <div style={{
            fontFamily: 'Orbitron', fontSize: '0.8rem', fontWeight: 700,
            color: card.highlightColor,
            border: `1px solid ${card.highlightColor}55`,
            padding: '0.5rem 1rem', textAlign: 'center',
            boxShadow: `0 0 16px ${card.highlightColor}22`,
            letterSpacing: '0.1em',
          }}>
            {card.highlight}
          </div>
        )}

        {card.signals && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {card.signals.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                background: `${s.color}08`,
                border: `1px solid ${s.color}33`,
              }}>
                <div style={{
                  fontFamily: 'Orbitron', fontSize: '0.65rem', fontWeight: 700,
                  color: s.color, letterSpacing: '0.1em', minWidth: '60px',
                  textShadow: `0 0 8px ${s.color}66`,
                }}>
                  {s.name}
                </div>
                <div style={{ width: '1px', height: '20px', background: `${s.color}33` }}/>
                <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a7a5a', lineHeight: 1.5 }}>
                  {s.meaning}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', height: '1px', background: `linear-gradient(90deg,${color}44,transparent)` }}/>
      </div>
    </div>
  );
}

export default function LevelBriefing({ levelNumber = 1, onComplete }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [exiting, setExiting] = useState(false);

  const briefing = levelBriefings[levelNumber];
  if (!briefing) return null;

  const totalCards = briefing.cards.length;

  const handleNext = () => {
    if (currentCard < totalCards - 1) {
      setCurrentCard(c => c + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setExiting(true);
    setTimeout(() => onComplete?.(), 500);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(1,4,8,0.96)',
      backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column',
      opacity: exiting ? 0 : 1,
      transition: 'opacity 0.5s',
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 2rem',
        borderBottom: `1px solid ${briefing.color}22`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(1,4,8,0.9)',
      }}>
        <div>
          <div style={{ fontFamily: 'Orbitron', fontSize: '0.75rem', fontWeight: 900, color: briefing.color, letterSpacing: '0.2em' }}>
            {briefing.title}
          </div>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.55rem', color: '#004d12', letterSpacing: '0.2em', marginTop: '2px' }}>
            {briefing.subtitle} — MISSION BRIEFING
          </div>
        </div>
        <button
          onClick={handleComplete}
          style={{
            background: 'transparent', border: '1px solid #ffffff22',
            color: '#444', padding: '0.3rem 0.8rem',
            fontFamily: 'Share Tech Mono', fontSize: '0.6rem',
            letterSpacing: '0.1em', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#ffffff44'; e.currentTarget.style.color='#888'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='#ffffff22'; e.currentTarget.style.color='#444'; }}
        >
          SKIP ›
        </button>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
        {briefing.cards.map((_, i) => (
          <div key={i} onClick={() => setCurrentCard(i)} style={{
            width: i === currentCard ? '24px' : '8px', height: '8px',
            borderRadius: '4px',
            background: i <= currentCard ? briefing.color : `${briefing.color}22`,
            boxShadow: i === currentCard ? `0 0 8px ${briefing.color}` : 'none',
            transition: 'all 0.3s', cursor: 'pointer',
          }}/>
        ))}
      </div>

      {/* Cards */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {briefing.cards.map((card, i) => (
          <ComicCard key={i} card={card} isActive={i === currentCard} color={briefing.color} />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '1rem 2rem',
        borderTop: `1px solid ${briefing.color}22`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button
          onClick={() => setCurrentCard(c => Math.max(0, c - 1))}
          disabled={currentCard === 0}
          style={{
            background: 'transparent', border: `1px solid ${briefing.color}33`,
            color: currentCard === 0 ? '#222' : briefing.color,
            padding: '0.4rem 1rem', fontFamily: 'Share Tech Mono',
            fontSize: '0.65rem', letterSpacing: '0.1em',
            cursor: currentCard === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ‹ PREV
        </button>

        <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.6rem', color: '#333', letterSpacing: '0.1em' }}>
          {currentCard + 1} / {totalCards}
        </div>

        <button
          onClick={handleNext}
          style={{
            background: currentCard === totalCards - 1 ? briefing.color : 'transparent',
            border: `1px solid ${briefing.color}`,
            color: currentCard === totalCards - 1 ? '#000' : briefing.color,
            padding: '0.4rem 1.2rem', fontFamily: 'Share Tech Mono',
            fontSize: '0.65rem', letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: currentCard === totalCards - 1 ? `0 0 16px ${briefing.color}44` : 'none',
          }}
        >
          {currentCard === totalCards - 1 ? 'START MISSION ›' : 'NEXT ›'}
        </button>
      </div>
    </div>
  );
}