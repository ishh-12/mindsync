import React from 'react';
import ClueBox from './ClueBox';
import SignalPanel from './SignalPanel';

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
      <SignalPanel onSignal={onSignal} lastSignal={lastSignal} />
    </div>
  );
}