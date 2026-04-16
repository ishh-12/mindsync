import React from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderboardTable from './components/LeaderboardTable';

export default function LeaderboardContainer() {
  const navigate = useNavigate();

  return (
    <div className="mobile-page mobile-center" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '2rem',
    }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      <div className="mobile-card mobile-card--tight" style={{
        border: '1px solid #1a2d44', padding: '2.5rem',
        background: '#0d1421', maxWidth: '500px', width: '100%',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#ffd60a' }} />

        <button onClick={() => navigate('/')} style={{
          background: 'transparent', border: 'none', color: '#4a6480',
          fontFamily: 'Share Tech Mono', fontSize: '0.75rem',
          cursor: 'pointer', letterSpacing: '0.1em', marginBottom: '1.5rem',
          padding: 0,
        }}
          onMouseEnter={e => e.target.style.color = '#00e5ff'}
          onMouseLeave={e => e.target.style.color = '#4a6480'}
        >BACK</button>

        <div style={{ fontFamily: 'Share Tech Mono', color: '#ffd60a', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
          {'// RANKINGS'}
        </div>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', fontWeight: 900, color: '#e8f4f8', marginBottom: '2rem' }}>
          LEADERBOARD
        </h2>

        <LeaderboardTable />

        <button onClick={() => navigate('/create-room')} style={{
          width: '100%', marginTop: '2rem',
          background: '#00e5ff', color: '#080c14',
          border: 'none', padding: '0.9rem',
          fontFamily: 'Barlow Condensed', fontWeight: 700,
          fontSize: '1.1rem', letterSpacing: '0.15em',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(0,229,255,0.3)',
        }}>
          PLAY NOW
        </button>
      </div>
    </div>
  );
}
