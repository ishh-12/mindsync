import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MESSAGES = {
  perfect: {
    status: 'CITY SAVED',
    color: '#00ff41',
    headline: 'FLAWLESS COORDINATION.',
    sub: 'The AI threw everything at you. Corrupted signals. Jammed transmissions. A 8-second countdown. You and your teammate never broke. The bunker held. The city survived.',
    tag: '► ALL THREATS NEUTRALIZED',
  },
  good: {
    status: 'CITY DAMAGED',
    color: '#ffcc00',
    headline: 'YOU HELD THE LINE.',
    sub: 'The AI managed to slip through your defenses. Some signals were misread. Some threats got past. But in the end — you survived. The city took damage. But it still stands.',
    tag: '► PARTIAL MISSION SUCCESS',
  },
  bad: {
    status: 'BUNKER FELL',
    color: '#ff0033',
    headline: 'THE AI WON THIS TIME.',
    sub: 'Your signals broke down under pressure. The AI exploited every gap in your communication. The bunker was overrun. The city is gone. But survivors remember. Try again.',
    tag: '► MISSION FAILED',
  },
};

const TypeWriter = ({ text, speed = 30 }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return <span>{displayed}<span style={{ animation: 'blink 1s infinite' }}>█</span></span>;
};

export default function ResultContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score ?? 0;
  const correct = location.state?.correct ?? 0;

  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(false);

  // Determine outcome
  const outcome = correct >= 5 ? 'perfect' : correct >= 3 ? 'good' : 'bad';
  const msg = MESSAGES[outcome];

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setTimeout(() => setPhase(1), 800);
    setTimeout(() => setPhase(2), 2000);
    setTimeout(() => setPhase(3), 3500);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '2rem', position: 'relative', background: '#020a06',
    }}>
      {/* Circuit bg */}
      <div className="circuit-bg" />

      {/* Scan line */}
      <div style={{
        position: 'fixed', left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${msg.color}44, transparent)`,
        animation: 'scan 4s linear infinite', pointerEvents: 'none', zIndex: 5,
      }} />

      <div style={{
        maxWidth: '480px', width: '100%', position: 'relative', zIndex: 10,
        opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
      }}>

        {/* Phase 0 — Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#003d0f', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
            ▶ TRANSMITTING DEBRIEF...
          </div>
          <div style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#005514', letterSpacing: '0.2em' }}>
            OPERATION: CONTROL ROOM CHAOS &nbsp;|&nbsp; DEBRIEF REPORT
          </div>
        </div>

        {/* Main card */}
        <div style={{
          border: `1px solid ${msg.color}33`,
          background: '#030f08', position: 'relative', overflow: 'hidden',
        }}>
          {/* Top accent */}
          <div style={{ height: '3px', background: msg.color, boxShadow: `0 0 20px ${msg.color}` }} />

          {/* Corner dots */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', width: '5px', height: '5px', background: msg.color, boxShadow: `0 0 6px ${msg.color}` }} />
          <div style={{ position: 'absolute', top: '12px', right: '12px', width: '5px', height: '5px', background: msg.color, boxShadow: `0 0 6px ${msg.color}` }} />

          <div style={{ padding: '2.5rem 2rem' }}>

            {/* Status */}
            {phase >= 1 && (
              <div style={{ marginBottom: '2rem', animation: 'fadeInUp 0.6s ease' }}>
                <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#005514', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
                  MISSION STATUS
                </div>
                <div style={{
                  fontFamily: 'Orbitron', fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
                  fontWeight: 900, color: msg.color,
                  textShadow: `0 0 20px ${msg.color}, 0 0 40px ${msg.color}44`,
                  letterSpacing: '0.1em',
                  animation: outcome === 'bad' ? 'glitch 3s infinite' : 'flicker 6s infinite',
                }}>
                  {msg.status}
                </div>
              </div>
            )}

            {/* Divider with wire */}
            {phase >= 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${msg.color}44, transparent)` }} />
                <div style={{ width: '6px', height: '6px', background: msg.color, transform: 'rotate(45deg)', boxShadow: `0 0 8px ${msg.color}` }} />
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${msg.color}44)` }} />
              </div>
            )}

            {/* Headline */}
            {phase >= 2 && (
              <div style={{ marginBottom: '1.5rem', animation: 'fadeInUp 0.6s ease' }}>
                <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#005514', letterSpacing: '0.3em', marginBottom: '0.75rem' }}>
                  FIELD REPORT
                </div>
                <div style={{
                  fontFamily: 'VT323', fontSize: '1.6rem',
                  color: msg.color, letterSpacing: '0.05em', lineHeight: 1.2,
                }}>
                  {msg.headline}
                </div>
              </div>
            )}

            {/* Story text with typewriter */}
            {phase >= 3 && (
              <div style={{ marginBottom: '2rem', animation: 'fadeInUp 0.6s ease' }}>
                <div style={{
                  fontFamily: 'Share Tech Mono', fontSize: '0.72rem',
                  color: '#005514', lineHeight: 1.9, letterSpacing: '0.03em',
                }}>
                  <TypeWriter text={msg.sub} speed={25} />
                </div>
              </div>
            )}

            {/* Tag */}
            {phase >= 3 && (
              <div style={{
                fontFamily: 'Share Tech Mono', fontSize: '0.65rem',
                color: msg.color, letterSpacing: '0.15em',
                borderTop: `1px solid ${msg.color}22`, paddingTop: '1rem',
                marginBottom: '2rem',
              }}>
                {msg.tag}
              </div>
            )}

            {/* Buttons */}
            {phase >= 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeInUp 0.6s ease' }}>
                <button onClick={() => navigate('/create-room')} style={{
                  width: '100%', background: 'transparent',
                  color: msg.color, border: `1px solid ${msg.color}`,
                  padding: '0.9rem', fontFamily: 'Orbitron', fontWeight: 700,
                  fontSize: '0.85rem', letterSpacing: '0.15em', cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: `0 0 15px ${msg.color}22, inset 0 0 15px ${msg.color}08`,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${msg.color}15`}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  ▶ REDEPLOY
                </button>

                <button onClick={() => navigate('/')} style={{
                  width: '100%', background: 'transparent',
                  color: '#005514', border: '1px solid #00ff4122',
                  padding: '0.9rem', fontFamily: 'Share Tech Mono',
                  fontSize: '0.75rem', letterSpacing: '0.15em', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#00ff41'; e.currentTarget.style.borderColor = '#00ff4166'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#005514'; e.currentTarget.style.borderColor = '#00ff4122'; }}
                >
                  ← RETURN TO BASE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom classification */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontFamily: 'Share Tech Mono', fontSize: '0.6rem', color: '#003d0f', letterSpacing: '0.2em' }}>
          ██████ CLASSIFIED ██████ MINDSYNC OPS ██████ DO NOT DISTRIBUTE
        </div>
      </div>
    </div>
  );
}