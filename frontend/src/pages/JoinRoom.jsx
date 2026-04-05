import React from 'react';
import { useNavigate } from 'react-router-dom';
import JoinRoomForm from '../features/room/components/JoinRoomForm';

export default function JoinRoom() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '2rem',
      position: 'relative',
    }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />
      <button onClick={() => navigate('/')} style={{
        position: 'fixed', top: '1.5rem', left: '1.5rem',
        background: 'transparent', border: 'none',
        color: '#4a6480', fontFamily: 'Share Tech Mono',
        fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.1em',
      }}
        onMouseEnter={e => e.target.style.color = '#ff3b5c'}
        onMouseLeave={e => e.target.style.color = '#4a6480'}
      >← BACK</button>
      <JoinRoomForm />
    </div>
  );
}