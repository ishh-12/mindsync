import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TimerBar from './components/TimerBar';

const LEVELS = [
  {
    id: 1,
    name: 'WARMUP',
    subtitle: 'THREAT ASSESSMENT',
    duration: 30,
    operatorData: { label: 'THREAT LEVEL', value: '20', danger: 'HIGH' },
    options: ['18', '19', '20', '21'],
    answer: '20',
    corrupt: false,
    silenced: false,
    description: 'HIGH = exact match. Stay focused.',
  },
  {
    id: 2,
    name: 'INFECTION ZONE',
    subtitle: 'EVACUATION PROTOCOL',
    duration: 30,
    operatorData: { label: 'EVACUATE TO', value: 'ROOF', danger: 'LOW' },
    options: ['BASEMENT', 'ROOF', 'TUNNEL', 'GARAGE'],
    answer: 'ROOF',
    corrupt: false,
    silenced: false,
    description: 'LOW = safest. HIGH = most exposed.',
  },
  {
    id: 3,
    name: 'BIOHAZARD',
    subtitle: 'CORRUPTED TRANSMISSION',
    duration: 25,
    operatorData: { label: 'THREAT', value: '☣️', danger: 'MEDIUM' },
    realDanger: 'HIGH',
    options: ['🧟', '☣️', '💉', '🔥'],
    answer: '☣️',
    corrupt: true,
    silenced: false,
    description: '⚠ AI HAS CORRUPTED THE DANGER LEVEL',
  },
  {
    id: 4,
    name: 'QUARANTINE ZONE',
    subtitle: 'MEDICAL EMERGENCY',
    duration: 25,
    operatorData: { label: 'INFECTED SYMPTOM', value: 'FOAMING MOUTH', danger: 'HIGH' },
    options: ['FEVER', 'LIMPING', 'FOAMING MOUTH', 'BLEEDING EYES'],
    answer: 'FOAMING MOUTH',
    corrupt: false,
    silenced: false,
    description: 'HIGH = most severe symptom. Trust your instinct.',
  },
  {
    id: 5,
    name: 'BLACKOUT',
    subtitle: 'SIGNAL JAMMED',
    duration: 20,
    operatorData: { label: 'THREAT', value: '???', danger: '???' },
    options: ['SEAL DOOR', 'RUN', 'HIDE', 'FIGHT'],
    answer: 'HIDE',
    corrupt: false,
    silenced: true,
    description: '⛔ ALL SIGNALS JAMMED. ANALYST MUST DECIDE ALONE.',
  },
  {
    id: 6,
    name: 'LAST SURVIVOR',
    subtitle: 'FINAL ORDER',
    duration: 8,
    operatorData: { label: 'FINAL ORDER', value: 'DETONATE BUNKER', danger: 'HIGH' },
    options: ['EVACUATE', 'HIDE', 'DETONATE BUNKER', 'SEND SOS'],
    answer: 'DETONATE BUNKER',
    corrupt: false,
    silenced: false,
    description: 'BREACH = most extreme action. 8 SECONDS. DO IT.',
  },
];

export default function GameContainer({ levelNumber = 1, onLevelComplete, score, setScore, correct, setCorrect }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const levelIdx = levelNumber - 1;
  const [role, setRole] = useState('operator');
  const [selected, setSelected] = useState(null);
  const [signal, setSignal] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const level = LEVELS[levelIdx];

  const handleSelect = (val) => {
    if (selected || feedback) return;
    setSelected(val);
    const isCorrect = val === level.answer;
    const bonus = levelIdx === 4 ? 15 : levelIdx === 5 ? 20 : 0;
    const pts = isCorrect ? 10 + bonus : -5;
    const newScore = score + pts;
    const newCorrect = correct + (isCorrect ? 1 : 0);
    setScore(newScore);
    setCorrect(newCorrect);
    setFeedback(isCorrect ? '✓ SURVIVED' : '✗ COMPROMISED');
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setSignal(null);
      if (levelIdx < LEVELS.length - 1) onLevelComplete(levelNumber + 1);
      else navigate('/result', { state: { score: newScore, correct: newCorrect } });
    }, 1500);
  };

  const handleExpire = () => {
    if (feedback) return;
    const pts = -5;
    const newScore = score + pts;
    setScore(newScore);
    setFeedback('✗ TIME UP — THEY GOT IN');
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setSignal(null);
      if (levelIdx < LEVELS.length - 1) onLevelComplete(levelNumber + 1);
      else navigate('/result', { state: { score: newScore, correct: correct } });
    }, 1500);
  };

  const dangerColor = (danger) => {
    if (danger === 'HIGH') return '#ff3b5c';
    if (danger === 'MEDIUM') return '#ffd60a';
    if (danger === 'LOW') return '#00ff88';
    return '#4a6480';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,59,92,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,92,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      <div style={{
        border: `1px solid ${level.corrupt ? '#ff3b5c' : '#1a2d44'}`,
        padding: '2rem', background: '#0d1421',
        maxWidth: '420px', width: '100%', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: level.corrupt ? '#ff3b5c' : level.silenced ? '#4a6480' : '#00e5ff' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>
              LEVEL {level.id}/6
            </div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.3rem', fontWeight: 900, color: '#e8f4f8', letterSpacing: '0.05em' }}>
              {level.name}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.1em' }}>
              {level.subtitle}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>SCORE</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color: '#00e5ff' }}>{score}</div>
          </div>
        </div>

        {level.corrupt && (
          <div style={{
            background: 'rgba(255,59,92,0.08)', border: '1px solid #ff3b5c44',
            padding: '0.5rem 1rem', marginBottom: '1rem',
            fontFamily: 'Share Tech Mono', fontSize: '0.7rem',
            color: '#ff3b5c', letterSpacing: '0.1em', textAlign: 'center',
          }}>
            ⚠ WARNING: TRANSMISSION MAY BE CORRUPTED
          </div>
        )}

        {level.silenced && (
          <div style={{
            background: 'rgba(74,100,128,0.1)', border: '1px solid #4a648044',
            padding: '0.5rem 1rem', marginBottom: '1rem',
            fontFamily: 'Share Tech Mono', fontSize: '0.7rem',
            color: '#4a6480', letterSpacing: '0.1em', textAlign: 'center',
          }}>
            ⛔ ALL SIGNALS JAMMED THIS ROUND
          </div>
        )}

        <TimerBar key={`${levelIdx}-timer`} duration={level.duration} onExpire={handleExpire} />

        {feedback && (
          <div style={{
            textAlign: 'center', padding: '0.75rem',
            fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900,
            color: feedback.includes('✓') ? '#00ff88' : '#ff3b5c',
            letterSpacing: '0.2em', marginBottom: '1rem',
            border: `1px solid ${feedback.includes('✓') ? '#00ff88' : '#ff3b5c'}`,
            background: feedback.includes('✓') ? 'rgba(0,255,136,0.05)' : 'rgba(255,59,92,0.05)',
          }}>{feedback}</div>
        )}

        {/* OPERATOR VIEW */}
        {role === 'operator' && (
          <div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ff3b5c', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
              💀 ROLE: OPERATOR
            </div>

            <div style={{ border: '1px solid #1a2d44', padding: '1.5rem', background: '#080c14', marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: dangerColor(level.operatorData.danger) }} />
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
                {level.operatorData.label}
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: '2.5rem', fontWeight: 900, color: '#e8f4f8', marginBottom: '1rem' }}>
                {level.operatorData.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dangerColor(level.operatorData.danger), boxShadow: `0 0 8px ${dangerColor(level.operatorData.danger)}` }} />
                <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: dangerColor(level.operatorData.danger), letterSpacing: '0.2em' }}>
                  DANGER: {level.operatorData.danger}
                </span>
              </div>
            </div>

            {!level.silenced ? (
              <div>
                <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.3em', marginBottom: '0.75rem' }}>
                  // SEND SIGNAL TO ANALYST
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { label: 'STATIC', color: '#00ff88' },
                    { label: 'SIGNAL', color: '#ffd60a' },
                    { label: 'BREACH', color: '#ff3b5c' },
                  ].map(s => (
                    <button key={s.label} onClick={() => setSignal(s.label)} style={{
                      flex: 1, padding: '0.75rem 0.25rem',
                      background: signal === s.label ? s.color : 'transparent',
                      color: signal === s.label ? '#080c14' : s.color,
                      border: `1px solid ${s.color}44`,
                      fontFamily: 'Share Tech Mono', fontSize: '0.7rem',
                      letterSpacing: '0.05em', cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: signal === s.label ? `0 0 15px ${s.color}44` : 'none',
                    }}
                      onMouseEnter={e => { if (signal !== s.label) e.currentTarget.style.borderColor = s.color; }}
                      onMouseLeave={e => { if (signal !== s.label) e.currentTarget.style.borderColor = `${s.color}44`; }}
                    >{s.label}</button>
                  ))}
                </div>
                <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', marginTop: '0.75rem', letterSpacing: '0.05em' }}>
                  STATIC=LOW &nbsp;|&nbsp; SIGNAL=MEDIUM &nbsp;|&nbsp; BREACH=HIGH
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: '#4a6480', letterSpacing: '0.1em', border: '1px solid #1a2d44' }}>
                ⛔ CANNOT SEND SIGNALS THIS ROUND
              </div>
            )}
          </div>
        )}

        {/* ANALYST VIEW */}
        {role === 'analyst' && (
          <div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#00e5ff', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
              🧠 ROLE: ANALYST
            </div>

            <div style={{
              border: '1px solid #1a2d44', padding: '1rem',
              background: '#080c14', marginBottom: '1.5rem', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
                SIGNAL FROM OPERATOR
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color: signal ? '#ffd60a' : '#1a2d44', letterSpacing: '0.2em' }}>
                {signal || 'WAITING...'}
              </div>
            </div>

            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.3em', marginBottom: '0.75rem' }}>
              // SELECT DEFENSE
            </div>
            {level.options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} disabled={!!selected || !!feedback} style={{
                width: '100%', padding: '0.9rem',
                background: selected === opt ? '#00e5ff' : 'transparent',
                color: selected === opt ? '#080c14' : '#e8f4f8',
                border: `1px solid ${selected === opt ? '#00e5ff' : '#1a2d44'}`,
                fontFamily: 'Barlow Condensed', fontWeight: 700,
                fontSize: '1.2rem', letterSpacing: '0.1em',
                cursor: selected ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', marginBottom: '0.5rem',
                boxShadow: selected === opt ? '0 0 20px rgba(0,229,255,0.3)' : 'none',
              }}
                onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = '#00e5ff'; }}
                onMouseLeave={e => { if (selected !== opt) e.currentTarget.style.borderColor = '#1a2d44'; }}
              >{opt}</button>
            ))}

            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', marginTop: '0.5rem', letterSpacing: '0.05em' }}>
              STATIC=LOW &nbsp;|&nbsp; SIGNAL=MEDIUM &nbsp;|&nbsp; BREACH=HIGH
            </div>
          </div>
        )}

        {/* DEV role toggle */}
        <button onClick={() => setRole(r => r === 'operator' ? 'analyst' : 'operator')} style={{
          marginTop: '1.5rem', width: '100%', background: 'transparent',
          border: '1px solid #1a2d4466', color: '#4a648066',
          fontFamily: 'Share Tech Mono', fontSize: '0.65rem',
          letterSpacing: '0.1em', padding: '0.4rem', cursor: 'pointer',
        }}>
          [DEV] SWITCH → {role === 'operator' ? 'ANALYST' : 'OPERATOR'}
        </button>
      </div>
    </div>
  );
}