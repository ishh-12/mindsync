import React from 'react';

const steps = [
  { num: '01', title: 'CREATE A ROOM', desc: 'Host creates a room and shares the code with their teammate.' },
  { num: '02', title: 'SPLIT ROLES', desc: 'One player is the Analyst. One is the Operator. Each sees different data.' },
  { num: '03', title: 'COMMUNICATE', desc: 'Only 1-word signals allowed: ALPHA, BETA, GAMMA. No explanations.' },
  { num: '04', title: 'SURVIVE THE AI', desc: 'The AI tracks your patterns and actively tries to deceive you. Adapt or fail.' },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '6rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontFamily: 'Share Tech Mono', color: '#00e5ff', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
        {'// PROTOCOL'}
      </div>
      <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#e8f4f8', marginBottom: '3rem', letterSpacing: '-0.01em' }}>
        HOW IT WORKS
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            border: '1px solid #1a2d44', padding: '1.5rem',
            background: '#0d1421', position: 'relative',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#00e5ff'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a2d44'}
          >
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '3rem', fontWeight: 900, color: '#1a2d44', lineHeight: 1, marginBottom: '0.5rem' }}>{s.num}</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1rem', fontWeight: 700, color: '#00e5ff', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{s.title}</div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: '#4a6480', lineHeight: 1.7 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
