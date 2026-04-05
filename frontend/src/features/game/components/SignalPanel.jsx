import React, { useState } from 'react';

const SIGNALS = ['ALPHA', 'BETA', 'GAMMA'];

export default function SignalPanel({ onSignal, lastSignal, disabled }) {
  const [sent, setSent] = useState(null);

  const send = (signalValue) => {
    if (disabled) return;
    setSent(signalValue);
    if (onSignal) {
      onSignal(signalValue);
    }
    setTimeout(() => setSent(null), 1500);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.3em', marginBottom: '0.75rem' }}>
        {'// SEND SIGNAL'}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {SIGNALS.map(signalValue => (
          <button key={signalValue} onClick={() => send(signalValue)} disabled={disabled} style={{
            flex: 1, padding: '0.6rem',
            background: sent === signalValue ? '#00e5ff' : 'transparent',
            color: sent === signalValue ? '#080c14' : '#4a6480',
            border: `1px solid ${sent === signalValue ? '#00e5ff' : '#1a2d44'}`,
            fontFamily: 'Share Tech Mono', fontSize: '0.75rem',
            letterSpacing: '0.1em', cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { if (!disabled && sent !== signalValue) { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.color = '#00e5ff'; } }}
            onMouseLeave={e => { if (sent !== signalValue) { e.currentTarget.style.borderColor = '#1a2d44'; e.currentTarget.style.color = '#4a6480'; } }}
          >{signalValue}</button>
        ))}
      </div>
      {lastSignal && (
        <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ffd60a', marginTop: '0.5rem', letterSpacing: '0.1em' }}>
          TEAMMATE: {lastSignal}
        </div>
      )}
    </div>
  );
}
