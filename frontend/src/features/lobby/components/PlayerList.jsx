import React from 'react';

export default function PlayerList({ players }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ fontFamily: 'Share Tech Mono', color: '#4a6480', fontSize: '0.7rem', letterSpacing: '0.3em', marginBottom: '1rem' }}>
        PLAYERS [{players.length}/2]
      </div>
      {[0, 1].map(i => (
        <div key={i} style={{
          border: '1px solid #1a2d44', padding: '0.75rem 1rem',
          marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: players[i] ? '#0d1421' : 'transparent',
          transition: 'all 0.3s',
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: players[i] ? '#00ff88' : '#1a2d44',
            boxShadow: players[i] ? '0 0 8px #00ff88' : 'none',
          }} />
          <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.85rem', color: players[i] ? '#e8f4f8' : '#1a2d44' }}>
            {players[i] ? players[i].name : 'WAITING FOR PLAYER...'}
          </span>
          {players[i]?.role && (
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: players[i].role === 'operator' ? '#ff3b5c' : '#00e5ff', letterSpacing: '0.1em' }}>
              [{players[i].role?.toUpperCase()}]
            </span>
          )}
          {players[i]?.isHost && (
            <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#ffd60a', letterSpacing: '0.1em' }}>HOST</span>
          )}
        </div>
      ))}
    </div>
  );
}