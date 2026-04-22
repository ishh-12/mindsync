import React from 'react';
import ClueBox from './ClueBox';
import SignalPanel from './SignalPanel';

const SIGNAL_RULES = [
  { label: 'STATIC', meaning: 'Routine or expected habit', color: '#00ff88' },
  { label: 'SIGNAL', meaning: 'Check, confirm, or read again', color: '#ffd60a' },
  { label: 'BREACH', meaning: 'Urgent, high-risk, or panic state', color: '#ff3b5c' },
];

export default function AnalystView({ level, clue, isCorrupted, onSignal, lastSignal }) {
  return (
    <div>
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#00e5ff', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
        🧠 ROLE: ANALYST
      </div>
      <ClueBox clue={clue} isCorrupted={isCorrupted} />
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', lineHeight: 1.8, marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
        You see the target. Your operator sees the options.<br />
        Send a signal to guide them.
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
      <SignalPanel onSignal={onSignal} lastSignal={lastSignal} />
    </div>
  );
}