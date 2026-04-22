import React from 'react';
import OptionButton from './OptionButton';
import SignalPanel from './SignalPanel';

const SIGNAL_RULES = [
  { label: 'STATIC', meaning: 'Routine or expected habit', color: '#00ff88' },
  { label: 'SIGNAL', meaning: 'Check, confirm, or read again', color: '#ffd60a' },
  { label: 'BREACH', meaning: 'Urgent, high-risk, or panic state', color: '#ff3b5c' },
];

export default function OperatorView({ options, onSelect, selected, onSignal, lastSignal }) {
  return (
    <div>
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ffd60a', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
        ROLE: OPERATOR
      </div>
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.3em', marginBottom: '0.75rem' }}>
        {'// SELECT OPTION'}
      </div>
      <div style={{ border: '1px solid #1a2d44', background: '#080c14', padding: '0.9rem 1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.63rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '0.6rem' }}>
          SIGNAL RULES
        </div>
        <div style={{ display: 'grid', gap: '0.55rem' }}>
          {SIGNAL_RULES.map((rule) => (
            <div key={rule.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'baseline', fontFamily: 'Share Tech Mono', fontSize: '0.68rem', lineHeight: 1.5 }}>
              <span style={{ color: rule.color, letterSpacing: '0.14em' }}>{rule.label}</span>
              <span style={{ color: '#9db0c4', textAlign: 'right' }}>{rule.meaning}</span>
            </div>
          ))}
        </div>
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
