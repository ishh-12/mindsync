import React from 'react';

export default function GameModes() {
  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontFamily: 'Share Tech Mono', color: '#00e5ff', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>// MODES</div>
      <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#e8f4f8', marginBottom: '3rem' }}>GAME MODES</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {[
          { icon: '🎮', label: 'CASUAL', color: '#00ff88', desc: 'Jump in anytime. Infinite rooms. Pure fun with no pressure.', tag: 'PLAY NOW' },
          { icon: '🏆', label: 'COMPETITIVE', color: '#ffd60a', desc: 'Ranked matches. Timed rounds. Climb the leaderboard.', tag: 'COMING SOON' },
        ].map((m, i) => (
          <div key={i} style={{
            border: `1px solid ${m.color}22`, padding: '2rem',
            background: `linear-gradient(135deg, #0d1421, #111827)`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: m.color, opacity: 0.6 }} />
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{m.icon}</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color: m.color, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{m.label}</div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: '#4a6480', lineHeight: 1.7, marginBottom: '1.5rem' }}>{m.desc}</div>
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: m.color, border: `1px solid ${m.color}44`, padding: '0.2rem 0.6rem', letterSpacing: '0.1em' }}>{m.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}