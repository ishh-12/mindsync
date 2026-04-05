import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '1rem 2rem',
      background: scrolled ? 'rgba(8,12,20,0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid #1a2d44' : 'none',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      transition: 'all 0.3s ease',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
    }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.4rem', fontWeight: 900, color: '#00e5ff', letterSpacing: '0.1em' }}>
        ⚔️ MINDSYNC
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => navigate('/leaderboard')} style={{
          background: 'transparent', border: '1px solid #1a2d44',
          color: '#4a6480', padding: '0.4rem 1rem',
          fontFamily: 'Share Tech Mono, monospace', cursor: 'pointer',
          fontSize: '0.75rem', letterSpacing: '0.1em',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = '#00e5ff'; e.target.style.color = '#00e5ff'; }}
          onMouseLeave={e => { e.target.style.borderColor = '#1a2d44'; e.target.style.color = '#4a6480'; }}
        >LEADERBOARD</button>
      </div>
    </nav>
  );
}