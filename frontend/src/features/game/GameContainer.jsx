import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TimerBar from './components/TimerBar';
import AnalystView from './components/AnalystView';
import OperatorView from './components/OperatorView';

const LEVELS = [
  { name: 'WARMUP', duration: 30, clue: 'Target = 20', options: [5, 7, 20, 3], answer: 20, corrupt: false },
  { name: 'SPLIT INFO', duration: 30, clue: 'Target = 7', options: [5, 7, 10, 3], answer: 7, corrupt: false },
  { name: 'MISLEADING', duration: 30, clue: 'Target = 10', options: [5, 7, 10, 3], answer: 10, corrupt: true },
  { name: 'CORRUPTION', duration: 30, clue: 'Target = 5', options: [5, 7, 10, 3], answer: 5, corrupt: true },
  { name: 'PRESSURE', duration: 30, clue: 'Target = 3', options: [5, 7, 10, 3], answer: 3, corrupt: false },
  { name: 'FINAL CHAOS', duration: 30, clue: 'Target = 7', options: [5, 7, 10, 3], answer: 7, corrupt: true },
];

export default function GameContainer() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [levelIdx, setLevelIdx] = useState(0);
  const [role, setRole] = useState('analyst'); // toggle for testing
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [signal, setSignal] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const level = LEVELS[levelIdx];

  const handleSelect = (val) => {
    setSelected(val);
    const correct = val === level.answer;
    const pts = correct ? 10 : -5;
    setScore(s => s + pts + (levelIdx === 5 ? 20 : 0));
    setFeedback(correct ? '✓ CORRECT' : '✗ WRONG');
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setSignal(null);
      if (levelIdx < LEVELS.length - 1) setLevelIdx(i => i + 1);
      else navigate('/result', { state: { score: score + pts } });
    }, 1200);
  };

  const handleExpire = () => {
    setScore(s => s - 5);
    setFeedback('✗ TIME UP');
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setSignal(null);
      if (levelIdx < LEVELS.length - 1) setLevelIdx(i => i + 1);
      else navigate('/result', { state: { score } });
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      <div style={{ border: '1px solid #1a2d44', padding: '2rem', background: '#0d1421', maxWidth: '420px', width: '100%', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>
              LEVEL {levelIdx + 1}/6
            </div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.2rem', fontWeight: 900, color: '#e8f4f8', letterSpacing: '0.1em' }}>
              {level.name}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>SCORE</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color: '#00e5ff' }}>{score}</div>
          </div>
        </div>

        <TimerBar key={levelIdx} duration={level.duration} onExpire={handleExpire} />

        {feedback && (
          <div style={{
            textAlign: 'center', padding: '0.75rem',
            fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900,
            color: feedback.includes('✓') ? '#00ff88' : '#ff3b5c',
            letterSpacing: '0.2em', marginBottom: '1rem',
            border: `1px solid ${feedback.includes('✓') ? '#00ff88' : '#ff3b5c'}`,
          }}>{feedback}</div>
        )}

        {role === 'analyst'
          ? <AnalystView level={level} clue={level.clue} isCorrupted={level.corrupt} onSignal={setSignal} lastSignal={signal} />
          : <OperatorView options={level.options} onSelect={handleSelect} selected={selected} onSignal={setSignal} lastSignal={signal} />
        }

        {/* Role toggle for solo testing */}
        <button onClick={() => setRole(r => r === 'analyst' ? 'operator' : 'analyst')} style={{
          marginTop: '1rem', width: '100%', background: 'transparent',
          border: '1px solid #1a2d44', color: '#4a6480',
          fontFamily: 'Share Tech Mono', fontSize: '0.65rem',
          letterSpacing: '0.1em', padding: '0.4rem', cursor: 'pointer',
        }}>
          [DEV] SWITCH ROLE → {role === 'analyst' ? 'OPERATOR' : 'ANALYST'}
        </button>
      </div>
    </div>
  );
}