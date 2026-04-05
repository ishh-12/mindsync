import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../../services/api';

export default function CreateRoomForm() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);

    const data = await createRoom();

    if (data.success) {
      navigate(`/lobby/${data.roomCode}?name=${encodeURIComponent(name.trim())}&host=true`);
      return;
    }

    alert(data.message || 'Unable to create room');
    setLoading(false);
  };

  return (
    <div style={{
      border: '1px solid #1a2d44', padding: '2.5rem',
      background: '#0d1421', maxWidth: '420px', width: '100%',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#00e5ff' }} />

      <div style={{ fontFamily: 'Share Tech Mono', color: '#00e5ff', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
        {'// INITIALIZE ROOM'}
      </div>
      <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', fontWeight: 900, color: '#e8f4f8', marginBottom: '2rem' }}>
        CREATE ROOM
      </h2>

      <label style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem' }}>
        YOUR CALLSIGN
      </label>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleCreate()}
        placeholder="ENTER NAME..."
        maxLength={16}
        style={{
          width: '100%', background: '#080c14',
          border: '1px solid #1a2d44', color: '#e8f4f8',
          padding: '0.75rem 1rem', fontFamily: 'Share Tech Mono',
          fontSize: '0.9rem', outline: 'none', marginBottom: '1.5rem',
          transition: 'border-color 0.2s', boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = '#00e5ff'}
        onBlur={e => e.target.style.borderColor = '#1a2d44'}
      />

      <button
        onClick={handleCreate}
        disabled={!name.trim() || loading}
        style={{
          width: '100%', background: name.trim() ? '#00e5ff' : '#1a2d44',
          color: name.trim() ? '#080c14' : '#4a6480',
          border: 'none', padding: '0.9rem',
          fontFamily: 'Barlow Condensed', fontWeight: 700,
          fontSize: '1.1rem', letterSpacing: '0.15em',
          cursor: name.trim() ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          boxShadow: name.trim() ? '0 0 20px rgba(0,229,255,0.3)' : 'none',
        }}
      >
        {loading ? 'INITIALIZING...' : 'CREATE ROOM ->'}
      </button>
    </div>
  );
}
