import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', textAlign: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease', position: 'relative' }}>
        <div style={{ fontFamily: 'Share Tech Mono', color: '#00e5ff', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1rem' }}>
          {'// CLASSIFIED: MULTIPLAYER PROTOCOL'}
        </div>

        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 'clamp(3rem, 10vw, 7rem)',
          fontWeight: 900, lineHeight: 0.9,
          color: '#e8f4f8', letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
        }}>
          CONTROL<br />
          <span style={{ color: '#00e5ff', WebkitTextStroke: '0px', textShadow: '0 0 30px rgba(0,229,255,0.5)' }}>ROOM</span><br />
          CHAOS
        </h1>

        <p style={{
          fontFamily: 'Share Tech Mono', color: '#4a6480',
          fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 2.5rem',
          lineHeight: 1.8, letterSpacing: '0.05em',
        }}>
          2 players. split information. restricted communication.<br />
          an AI that lies to you. can you trust your teammate?
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/create-room')} style={{
            background: '#00e5ff', color: '#080c14',
            border: 'none', padding: 'clamp(0.65rem, 2vw, 0.85rem) clamp(1.1rem, 3vw, 1.7rem)',
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
            fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', letterSpacing: '0.15em',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 0 20px rgba(0,229,255,0.3)',
            minHeight: '44px',
            minWidth: '100px',
          }}
            onMouseEnter={e => e.target.style.boxShadow = '0 0 40px rgba(0,229,255,0.6)'}
            onMouseLeave={e => e.target.style.boxShadow = '0 0 20px rgba(0,229,255,0.3)'}
            onTouchStart={e => e.currentTarget.style.opacity = '0.85'}
            onTouchEnd={e => e.currentTarget.style.opacity = '1'}
          >CREATE 🚀</button>

          <button onClick={() => navigate('/join-room')} style={{
            background: 'transparent', color: '#00e5ff',
            border: '1px solid #00e5ff', padding: 'clamp(0.65rem, 2vw, 0.85rem) clamp(1.1rem, 3vw, 1.7rem)',
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
            fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', letterSpacing: '0.15em',
            cursor: 'pointer', transition: 'all 0.2s',
            minHeight: '44px',
            minWidth: '100px',
          }}
            onMouseEnter={e => { e.target.style.background = 'rgba(0,229,255,0.08)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; }}
            onTouchStart={e => e.currentTarget.style.background = 'rgba(0,229,255,0.08)'}
            onTouchEnd={e => e.currentTarget.style.background = 'transparent'}
          >JOIN 🎮</button>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: '#1a2d44', fontSize: '0.7rem', fontFamily: 'Share Tech Mono', letterSpacing: '0.2em' }}>
        SCROLL DOWN
      </div>
    </section>
  );
}
