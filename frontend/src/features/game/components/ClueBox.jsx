import React from 'react';

export default function ClueBox({ clue, isCorrupted }) {
  return (
    <div style={{
      border: `1px solid ${isCorrupted ? '#ff3b5c' : '#1a2d44'}`,
      padding: '1.5rem', marginBottom: '1.5rem',
      background: isCorrupted ? 'rgba(255,59,92,0.05)' : '#080c14',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: isCorrupted ? '#ff3b5c' : '#00e5ff' }} />
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: isCorrupted ? '#ff3b5c' : '#4a6480', letterSpacing: '0.3em', marginBottom: '0.75rem' }}>
        {isCorrupted ? '⚠ SIGNAL CORRUPTED' : '// ANALYST FEED'}
      </div>
      <div style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', fontWeight: 900, color: isCorrupted ? '#ff3b5c' : '#00e5ff', letterSpacing: '0.1em' }}>
        {clue}
      </div>
    </div>
  );
}