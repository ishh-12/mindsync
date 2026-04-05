import React from 'react';
import OptionButton from './OptionButton';
import SignalPanel from './SignalPanel';

export default function OperatorView({ options, onSelect, selected, onSignal, lastSignal }) {
  return (
    <div>
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ffd60a', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
        ROLE: OPERATOR
      </div>
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.3em', marginBottom: '0.75rem' }}>
        {'// SELECT OPTION'}
      </div>
      {options.map((opt, i) => (
        <OptionButton key={i} value={opt} onClick={onSelect} selected={selected === opt} disabled={!!selected} />
      ))}
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', lineHeight: 1.8, margin: '1rem 0', letterSpacing: '0.05em' }}>
        Your analyst sees the target. Listen to their signal.
      </div>
      <SignalPanel onSignal={onSignal} lastSignal={lastSignal} />
    </div>
  );
}
