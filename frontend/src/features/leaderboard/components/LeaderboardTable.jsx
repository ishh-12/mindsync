import React from 'react';

const MOCK_DATA = [
  { rank: 1, name: 'SHADOW_OPS', score: 95, games: 12 },
  { rank: 2, name: 'CIPHER_X', score: 88, games: 8 },
  { rank: 3, name: 'DELTA_FORCE', score: 82, games: 15 },
  { rank: 4, name: 'GHOST_SIGNAL', score: 76, games: 6 },
  { rank: 5, name: 'BINARY_WOLF', score: 71, games: 9 },
];

const rankColor = (r) => {
  if (r === 1) return '#ffd60a';
  if (r === 2) return '#e8f4f8';
  if (r === 3) return '#ff8c42';
  return '#4a6480';
};

export default function LeaderboardTable() {
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 60px', gap: '0.5rem', padding: '0 0.5rem 0.75rem', borderBottom: '1px solid #1a2d44', marginBottom: '0.5rem' }}>
        {['#', 'CALLSIGN', 'SCORE', 'GAMES'].map(h => (
          <div key={h} style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>{h}</div>
        ))}
      </div>

      {MOCK_DATA.map((p, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '40px 1fr 80px 60px',
          gap: '0.5rem', padding: '0.75rem 0.5rem',
          borderBottom: '1px solid #1a2d441a',
          background: p.rank === 1 ? 'rgba(255,214,10,0.03)' : 'transparent',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.03)'}
          onMouseLeave={e => e.currentTarget.style.background = p.rank === 1 ? 'rgba(255,214,10,0.03)' : 'transparent'}
        >
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.2rem', fontWeight: 900, color: rankColor(p.rank) }}>
            {p.rank === 1 ? '👑' : p.rank}
          </div>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.8rem', color: '#e8f4f8', letterSpacing: '0.05em' }}>{p.name}</div>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.1rem', fontWeight: 700, color: '#00e5ff' }}>{p.score}</div>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: '#4a6480' }}>{p.games}</div>
        </div>
      ))}
    </div>
  );
}