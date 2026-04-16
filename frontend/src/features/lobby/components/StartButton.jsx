import React from 'react';

export default function StartButton({ canStart, isHost, onStart }) {
  if (!isHost) return (
    <div style={{ textAlign: 'center', fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: '#4a6480', letterSpacing: '0.1em', padding: '1rem' }}>
      WAITING FOR HOST TO START...
    </div>
  );

  return (
    <button onClick={onStart} disabled={!canStart} style={{
      width: '100%', background: canStart ? '#00e5ff' : '#1a2d44',
      color: canStart ? '#080c14' : '#4a6480',
      border: 'none', padding: '1rem',
      fontFamily: 'Barlow Condensed', fontWeight: 700,
      fontSize: 'clamp(0.95rem, 4vw, 1.2rem)', letterSpacing: '0.18em',
      cursor: canStart ? 'pointer' : 'not-allowed',
      transition: 'all 0.2s',
      boxShadow: canStart ? '0 0 30px rgba(0,229,255,0.4)' : 'none',
    }}>
      {canStart ? 'START GAME ->' : 'WAITING FOR PLAYERS...'}
    </button>
  );
}
