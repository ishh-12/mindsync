import React, { useState } from 'react';

const steps = [
  { num: '01', title: 'MAKE A ROOM', desc: 'Host creates a room, then invite your friend with the code.', icon: '◎' },
  { num: '02', title: 'ASSIGN ROLL', desc: 'One player becomes the Operator, the other becomes the Analyst.', icon: '◈' },
  { num: '03', title: 'SEND WILD SIGNALS', desc: 'Pick STATIC / SIGNAL / BREACH to describe how safe or risky the scene feels.', icon: '◉' },
  { num: '04', title: 'PICK THE ANSWER', desc: 'The Analyst uses scene + signal to choose the best option, then gets roasted.', icon: '◆' },
];

export default function HowItWorks() {
  const [active, setActive] = useState(null);

  return (
    <section style={{ padding: '6rem 2rem', maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <div style={{ width: '40px', height: '1px', background: '#00e5ff' }}/>
        <span style={{ fontFamily: 'Share Tech Mono', color: '#4a6480', fontSize: '0.68rem', letterSpacing: '0.3em' }}>{'// OPERATIONAL PROTOCOL'}</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,#00e5ff33,transparent)' }}/>
      </div>

      <h2 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 900, color: '#8bd3ff', marginBottom: '3rem', textShadow: '0 0 20px #00e5ff44', letterSpacing: '0.05em' }}>
        HOW IT WORKS
      </h2>

      {/* Steps grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1px', background: '#00e5ff11', border: '1px solid #00e5ff11' }}>
        {steps.map((s, i) => (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              padding: '1.75rem 1.5rem', background: active === i ? '#0b1a2c' : '#08111f',
              position: 'relative', overflow: 'hidden',
              transition: 'background 0.25s',
              cursor: 'default',
            }}
          >
            {/* Top wire accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: active === i ? 'linear-gradient(90deg,#00e5ff,#8bd3ff,transparent)' : 'linear-gradient(90deg,#00e5ff55,transparent)', transition: 'all 0.3s' }}/>

            {/* Flowing conduit on active */}
            {active === i && (
              <div style={{ position: 'absolute', top: 0, height: '2px', width: '60px', background: 'linear-gradient(90deg,transparent,rgba(0,229,255,0.8),transparent)', animation: 'data-flow-h 1.2s linear infinite' }}/>
            )}

            {/* Corner bolt */}
            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#08111f', border: '1px solid #00e5ff33' }}/>
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#08111f', border: '1px solid #00e5ff22' }}/>

            {/* Step number watermark */}
            <div style={{ fontFamily: 'VT323', fontSize: '5rem', color: active === i ? '#00e5ff12' : '#00e5ff08', lineHeight: 1, position: 'absolute', top: '0.25rem', right: '0.5rem', transition: 'color 0.3s' }}>{s.num}</div>

            {/* Icon */}
            <div style={{ fontFamily: 'VT323', fontSize: '1.8rem', color: active === i ? '#00e5ff' : '#4a6480', marginBottom: '0.75rem', textShadow: active === i ? '0 0 12px #00e5ff' : 'none', transition: 'all 0.3s' }}>{s.icon}</div>

            {/* Title row */}
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.62rem', color: '#8bd3ff', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5ff', boxShadow: active === i ? '0 0 8px #00e5ff' : '0 0 4px #00e5ff', transition: 'all 0.3s', animation: 'led-blink 2s infinite' }}/>
              {s.title}
            </div>

            {/* Desc */}
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: active === i ? '#c9d1d9' : '#8aa0b8', lineHeight: 1.75, transition: 'color 0.3s' }}>{s.desc}</div>

            {/* Bottom wire trace */}
            <div style={{ marginTop: '1.25rem', height: '1px', background: 'linear-gradient(90deg,#00e5ff33,transparent)' }}/>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.52rem', color: '#4a6480', letterSpacing: '0.15em', marginTop: '0.4rem' }}>STEP_{s.num} › PROTOCOL.ACTIVE</div>
          </div>
        ))}
      </div>
    </section>
  );
}
