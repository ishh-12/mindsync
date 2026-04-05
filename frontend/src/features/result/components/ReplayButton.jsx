import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReplayButton() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <button onClick={() => navigate('/create-room')} style={{
        width: '100%', background: '#00e5ff', color: '#080c14',
        border: 'none', padding: '0.9rem',
        fontFamily: 'Barlow Condensed', fontWeight: 700,
        fontSize: '1.1rem', letterSpacing: '0.15em',
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: '0 0 20px rgba(0,229,255,0.3)',
      }}
        onMouseEnter={e => e.target.style.boxShadow = '0 0 40px rgba(0,229,255,0.6)'}
        onMouseLeave={e => e.target.style.boxShadow = '0 0 20px rgba(0,229,255,0.3)'}
      >
        PLAY AGAIN →
      </button>

      <button onClick={() => navigate('/leaderboard')} style={{
        width: '100%', background: 'transparent', color: '#ffd60a',
        border: '1px solid #ffd60a44', padding: '0.9rem',
        fontFamily: 'Barlow Condensed', fontWeight: 700,
        fontSize: '1.1rem', letterSpacing: '0.15em',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#ffd60a'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#ffd60a44'}
      >
        VIEW LEADERBOARD
      </button>

      <button onClick={() => navigate('/')} style={{
        width: '100%', background: 'transparent', color: '#4a6480',
        border: '1px solid #1a2d44', padding: '0.9rem',
        fontFamily: 'Barlow Condensed', fontWeight: 700,
        fontSize: '1.1rem', letterSpacing: '0.15em',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#e8f4f8'}
        onMouseLeave={e => e.currentTarget.style.color = '#4a6480'}
      >
        HOME
      </button>
    </div>
  );
}