import React, { useState } from 'react';

const modes = [
  {
    icon: '▶', label: 'CASUAL MODE', color: '#00ff41',
    desc: 'Infinite rooms. Jump in anytime. No rankings. Pure survival training.',
    tag: 'ONLINE', tagColor: '#00ff41',
    lines: ['DIFFICULTY: ADAPTIVE', 'PLAYERS: 2', 'DURATION: ~3 MIN'],
  },
  {
    icon: '◆', label: 'COMPETITIVE', color: '#ffcc00',
    desc: 'Ranked matches. Timed sessions. Climb the global leaderboard.',
    tag: 'COMING SOON', tagColor: '#ffcc00',
    lines: ['DIFFICULTY: MAXIMUM', 'PLAYERS: 2', 'RANKED: YES'],
  },
];

export default function GameModes() {
  const [active, setActive] = useState(null);

  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <div style={{ width: '40px', height: '1px', background: '#00ff41' }}/>
        <span style={{ fontFamily: 'Share Tech Mono', color: '#005514', fontSize: '0.68rem', letterSpacing: '0.3em' }}>{'// MISSION SELECT'}</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,#00ff4133,transparent)' }}/>
      </div>

      <h2 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 900, color: '#00ff41', marginBottom: '3rem', textShadow: '0 0 20px #00ff4144', letterSpacing: '0.05em' }}>
        GAME MODES
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {modes.map((m, i) => (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              border: `1px solid ${active === i ? m.color + '66' : m.color + '22'}`,
              background: active === i ? '#051509' : '#030f08',
              position: 'relative', overflow: 'hidden',
              padding: '2rem', transition: 'all 0.3s',
              boxShadow: active === i ? `0 0 24px ${m.color}11, inset 0 0 24px ${m.color}05` : 'none',
            }}
          >
            {/* Top wire bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: m.color, opacity: active === i ? 0.9 : 0.5, transition: 'opacity 0.3s' }}/>

            {/* Flowing pulse on top wire */}
            {active === i && (
              <div style={{ position: 'absolute', top: 0, height: '3px', width: '80px', background: `linear-gradient(90deg,transparent,white,transparent)`, opacity: 0.4, animation: 'data-flow-h 1.5s linear infinite' }}/>
            )}

            {/* Left conduit strip */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: `linear-gradient(180deg,${m.color}66,${m.color}11,${m.color}66)` }}/>

            {/* Corner dots */}
            {[[8,8],[8,'auto'],['-1',8],['-1','auto']].slice(0,4).map((_,j) => null)}
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '5px', height: '5px', background: m.color, boxShadow: `0 0 6px ${m.color}`, animation: 'led-blink 2s infinite' }}/>
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '5px', height: '5px', background: m.color, opacity: 0.4 }}/>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '5px', height: '5px', background: m.color, opacity: 0.2 }}/>

            {/* Mode label */}
            <div style={{ fontFamily: 'Orbitron', fontSize: '1.2rem', fontWeight: 900, color: m.color, letterSpacing: '0.1em', marginBottom: '1rem', textShadow: active === i ? `0 0 20px ${m.color}88` : 'none', transition: 'text-shadow 0.3s' }}>
              {m.icon} {m.label}
            </div>

            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.72rem', color: active === i ? '#007a22' : '#005514', lineHeight: 1.75, marginBottom: '1.5rem', transition: 'color 0.3s' }}>{m.desc}</div>

            {/* Specs */}
            <div style={{ borderTop: `1px solid ${m.color}22`, borderBottom: `1px solid ${m.color}11`, padding: '0.75rem 0', marginBottom: '1.25rem' }}>
              {m.lines.map((l, j) => (
                <div key={j} style={{ fontFamily: 'Share Tech Mono', fontSize: '0.62rem', color: `${m.color}88`, letterSpacing: '0.1em', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '4px', height: '4px', background: m.color, opacity: 0.5 }}/>
                  {l}
                </div>
              ))}
            </div>

            {/* Oscilloscope preview */}
            <svg width="100%" height="28" style={{ display: 'block', marginBottom: '1rem', opacity: active === i ? 0.7 : 0.25, transition: 'opacity 0.3s' }}>
              <path
                d={`M0 14 ${Array.from({length:20},(_,k)=>`L${k*(100/19)}% ${14+Math.sin(k*0.8)*8}`).join(' ')}`}
                fill="none" stroke={m.color} strokeWidth="1.5"
              />
            </svg>

            {/* Status tag */}
            <span style={{
              fontFamily: 'Share Tech Mono', fontSize: '0.62rem',
              color: m.tagColor, border: `1px solid ${m.tagColor}44`,
              padding: '0.25rem 0.8rem', letterSpacing: '0.15em',
              animation: m.tag === 'ONLINE' ? 'led-blink 2s infinite' : 'none',
            }}>
              ● {m.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
