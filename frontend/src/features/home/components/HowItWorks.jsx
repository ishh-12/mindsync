import React, { useState } from 'react';

const steps = [
  { num: '01', title: 'ESTABLISH CONNECTION', desc: 'Host creates a room. Share the access code with your partner via any channel.', icon: '◎' },
  { num: '02', title: 'ROLE ASSIGNMENT',      desc: 'System assigns OPERATOR and ANALYST roles. Each receives classified intel.', icon: '◈' },
  { num: '03', title: 'TRANSMIT SIGNALS',     desc: 'Use only 3 coded signals: STATIC / SIGNAL / BREACH. No other communication.', icon: '◉' },
  { num: '04', title: 'SURVIVE THE AI',       desc: 'AI monitors patterns and corrupts your data. Adapt your signal strategy or fail.', icon: '◆' },
];

export default function HowItWorks() {
  const [active, setActive] = useState(null);

  return (
    <section style={{ padding: '6rem 2rem', maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <div style={{ width: '40px', height: '1px', background: '#00ff41' }}/>
        <span style={{ fontFamily: 'Share Tech Mono', color: '#005514', fontSize: '0.68rem', letterSpacing: '0.3em' }}>{'// OPERATIONAL PROTOCOL'}</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,#00ff4133,transparent)' }}/>
      </div>

      <h2 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 900, color: '#00ff41', marginBottom: '3rem', textShadow: '0 0 20px #00ff4144', letterSpacing: '0.05em' }}>
        HOW IT WORKS
      </h2>

      {/* Steps grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1px', background: '#00ff4111', border: '1px solid #00ff4111' }}>
        {steps.map((s, i) => (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              padding: '1.75rem 1.5rem', background: active === i ? '#051509' : '#020a06',
              position: 'relative', overflow: 'hidden',
              transition: 'background 0.25s',
              cursor: 'default',
            }}
          >
            {/* Top wire accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: active === i ? 'linear-gradient(90deg,#00ff41,#00e5ff,transparent)' : 'linear-gradient(90deg,#00ff4155,transparent)', transition: 'all 0.3s' }}/>

            {/* Flowing conduit on active */}
            {active === i && (
              <div style={{ position: 'absolute', top: 0, height: '2px', width: '60px', background: 'linear-gradient(90deg,transparent,rgba(0,255,65,0.8),transparent)', animation: 'data-flow-h 1.2s linear infinite' }}/>
            )}

            {/* Corner bolt */}
            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#031008', border: '1px solid #00ff4133' }}/>
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#031008', border: '1px solid #00ff4122' }}/>

            {/* Step number watermark */}
            <div style={{ fontFamily: 'VT323', fontSize: '5rem', color: active === i ? '#00ff4112' : '#00ff4108', lineHeight: 1, position: 'absolute', top: '0.25rem', right: '0.5rem', transition: 'color 0.3s' }}>{s.num}</div>

            {/* Icon */}
            <div style={{ fontFamily: 'VT323', fontSize: '1.8rem', color: active === i ? '#00ff41' : '#005514', marginBottom: '0.75rem', textShadow: active === i ? '0 0 12px #00ff41' : 'none', transition: 'all 0.3s' }}>{s.icon}</div>

            {/* Title row */}
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.62rem', color: '#00ff41', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff41', boxShadow: active === i ? '0 0 8px #00ff41' : '0 0 4px #00ff41', transition: 'all 0.3s', animation: 'led-blink 2s infinite' }}/>
              {s.title}
            </div>

            {/* Desc */}
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: active === i ? '#007a22' : '#005514', lineHeight: 1.75, transition: 'color 0.3s' }}>{s.desc}</div>

            {/* Bottom wire trace */}
            <div style={{ marginTop: '1.25rem', height: '1px', background: 'linear-gradient(90deg,#00ff4133,transparent)' }}/>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.52rem', color: '#003d0f', letterSpacing: '0.15em', marginTop: '0.4rem' }}>STEP_{s.num} › PROTOCOL.ACTIVE</div>
          </div>
        ))}
      </div>
    </section>
  );
}
