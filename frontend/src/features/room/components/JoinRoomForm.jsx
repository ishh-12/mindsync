import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JoinRoomForm() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!name.trim() || !code.trim()) return;
    setLoading(true);
    setTimeout(() => navigate(`/lobby/${code.toUpperCase()}?name=${name}&host=false`), 800);
  };

  const canJoin = name.trim() && code.trim();

  return (
    <div style={{
      border: '1px solid #1a2d44', padding: '2.5rem',
      background: '#0d1421', maxWidth: '420px', width: '100%',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#ff3b5c' }} />

      <div style={{ fontFamily: 'Share Tech Mono', color: '#ff3b5c', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
        // ACCESS ROOM
      </div>
      <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', fontWeight: 900, color: '#e8f4f8', marginBottom: '2rem' }}>
        JOIN ROOM
      </h2>

      {[
        { label: 'YOUR CALLSIGN', val: name, set: setName, ph: 'ENTER NAME...', max: 16 },
        { label: 'ROOM CODE', val: code, set: v => setCode(v.toUpperCase()), ph: 'ENTER CODE...', max: 6 },
      ].map((f, i) => (
        <div key={i} style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem' }}>
            {f.label}
          </label>
          <input
            value={f.val}
            onChange={e => f.set(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            placeholder={f.ph}
            maxLength={f.max}
            style={{
              width: '100%', background: '#080c14',
              border: '1px solid #1a2d44', color: '#e8f4f8',
              padding: '0.75rem 1rem', fontFamily: 'Share Tech Mono',
              fontSize: '0.9rem', outline: 'none',
              transition: 'border-color 0.2s', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#ff3b5c'}
            onBlur={e => e.target.style.borderColor = '#1a2d44'}
          />
        </div>
      ))}

      <button
        onClick={handleJoin}
        disabled={!canJoin || loading}
        style={{
          width: '100%', background: canJoin ? '#ff3b5c' : '#1a2d44',
          color: canJoin ? '#fff' : '#4a6480',
          border: 'none', padding: '0.9rem',
          fontFamily: 'Barlow Condensed', fontWeight: 700,
          fontSize: '1.1rem', letterSpacing: '0.15em',
          cursor: canJoin ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          boxShadow: canJoin ? '0 0 20px rgba(255,59,92,0.3)' : 'none',
        }}
      >
        {loading ? 'CONNECTING...' : 'JOIN ROOM →'}
      </button>
    </div>
  );
}