import React, { useState } from 'react';

export default function RoomCode({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{ fontFamily: 'Share Tech Mono', color: '#4a6480', fontSize: '0.7rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
        ROOM CODE
      </div>
      <div className="mobile-roomcode" style={{
        fontFamily: 'Barlow Condensed', fontSize: '4rem', fontWeight: 900,
        color: '#00e5ff', letterSpacing: '0.3em',
        textShadow: '0 0 30px rgba(0,229,255,0.5)',
      }}>{code}</div>
      <button onClick={copy} style={{
        background: 'transparent', border: '1px solid #1a2d44',
        color: copied ? '#00ff88' : '#4a6480',
        fontFamily: 'Share Tech Mono', fontSize: '0.7rem',
        letterSpacing: '0.2em', padding: '0.3rem 1rem',
        cursor: 'pointer', transition: 'all 0.2s', marginTop: '0.5rem',
      }}>
        {copied ? '✓ COPIED' : 'COPY CODE'}
      </button>
    </div>
  );
}