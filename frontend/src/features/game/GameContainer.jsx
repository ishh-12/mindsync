import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TimerBar from './components/TimerBar';

const LEVELS = [
  { id: 1, name: 'WARMUP', subtitle: 'THREAT ASSESSMENT', duration: 30, operatorData: { label: 'THREAT LEVEL', value: '20', danger: 'HIGH' }, options: ['18', '19', '20', '21'], answer: '20', corrupt: false, silenced: false },
  { id: 2, name: 'INFECTION ZONE', subtitle: 'EVACUATION PROTOCOL', duration: 30, operatorData: { label: 'EVACUATE TO', value: 'ROOF', danger: 'LOW' }, options: ['BASEMENT', 'ROOF', 'TUNNEL', 'GARAGE'], answer: 'ROOF', corrupt: false, silenced: false },
  { id: 3, name: 'BIOHAZARD', subtitle: 'CORRUPTED TRANSMISSION', duration: 25, operatorData: { label: 'THREAT', value: '☣️', danger: 'MEDIUM' }, options: ['���', '☣️', '���', '���'], answer: '☣️', corrupt: true, silenced: false },
  { id: 4, name: 'QUARANTINE ZONE', subtitle: 'MEDICAL EMERGENCY', duration: 25, operatorData: { label: 'INFECTED SYMPTOM', value: 'FOAMING MOUTH', danger: 'HIGH' }, options: ['FEVER', 'LIMPING', 'FOAMING MOUTH', 'BLEEDING EYES'], answer: 'FOAMING MOUTH', corrupt: false, silenced: false },
  { id: 5, name: 'BLACKOUT', subtitle: 'SIGNAL JAMMED', duration: 20, operatorData: { label: 'THREAT', value: '???', danger: '???' }, options: ['SEAL DOOR', 'RUN', 'HIDE', 'FIGHT'], answer: 'HIDE', corrupt: false, silenced: true },
  { id: 6, name: 'LAST SURVIVOR', subtitle: 'FINAL ORDER', duration: 8, operatorData: { label: 'FINAL ORDER', value: 'DETONATE BUNKER', danger: 'HIGH' }, options: ['EVACUATE', 'HIDE', 'DETONATE BUNKER', 'SEND SOS'], answer: 'DETONATE BUNKER', corrupt: false, silenced: false },
];

export default function GameContainer() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [levelIdx, setLevelIdx] = useState(0);
  const [role, setRole] = useState('operator');
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [signal, setSignal] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const level = LEVELS[levelIdx];

  const advanceLevel = (pts) => {
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setSignal(null);
      if (levelIdx < LEVELS.length - 1) {
        setLevelIdx((i) => i + 1);
      } else {
        navigate('/result', { state: { score: score + pts } });
      }
    }, 1500);
  };

  const handleSelect = (val) => {
    if (selected || feedback) return;
    setSelected(val);
    const correct = val === level.answer;
    const bonus = levelIdx === 4 ? 15 : levelIdx === 5 ? 20 : 0;
    const pts = correct ? 10 + bonus : -5;
    setScore((s) => s + pts);
    setFeedback(correct ? '✓ SURVIVED' : '✗ COMPROMISED');
    advanceLevel(pts);
  };

  const handleExpire = () => {
    if (feedback) return;
    const pts = -5;
    setScore((s) => s + pts);
    setFeedback('✗ TIME UP — THEY GOT IN');
    advanceLevel(pts);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,59,92,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,92,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      <div style={{ border: `1px solid ${level.corrupt ? '#ff3b5c' : '#1a2d44'}`, padding: '2rem', background: '#0d1421', maxWidth: '420px', width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: level.corrupt ? '#ff3b5c' : level.silenced ? '#4a6480' : '#00e5ff' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>LEVEL {level.id}/6</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.3rem', fontWeight: 900, color: '#e8f4f8', letterSpacing: '0.05em' }}>{level.name}</div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.1em' }}>{level.subtitle}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>SCORE</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color: '#00e5ff' }}>{score}</div>
          </div>
        </div>
        {level.corrupt && (
          <div style={{ background: 'rgba(255,59,92,0.08)', border: '1px solid #ff3b5c44', padding: '0.5rem 1rem', marginBottom: '1rem', fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ff3b5c', letterSpacing: '0.1em', textAlign: 'center' }}>
            ⚠ WARNING: TRANSMISSION MAY BE CORRUPTED
          </div>
        )}
        {level.silenced && (
          <div style={{ background: 'rgba(74,100,128,0.1)', border: '1px solid #4a648044', padding: '0.5rem 1rem', marginBottom: '1rem', fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.1em', textAlign: 'center' }}>
            ⛔ ALL SIGNALS JAMMED THIS ROUND
          </div>
        )}
        <TimerBar key={`${levelIdx}-timer`} duration={level.duration} onExpire={handleExpire} />
        {feedback && (
          <div style={{ textAlign: 'center', padding: '0.75rem', fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color: feedback.includes('✓') ? '#00ff88' : '#ff3b5c', letterSpacing: '0.2em', marginBottom: '1rem', border: `1px solid ${feedback.includes('✓') ? '#00ff88' : '#ff3b5c'}`, background: feedback.includes('✓') ? 'rgba(0,255,136,0.05)' : 'rgba(255,59,92,0.05)' }}>
            {feedback}
          </div>
        )}
        {role === 'operator' && (
          <div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '1rem' }}>��� ROLE: OPERATOR</div>
            <div style={{ border: '1px solid #1a2d44', padding: '1rem', background: '#080c14', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '0.25rem' }}>{level.operatorData.label}</div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', fontWeight: 900, color: '#e8f4f8' }}>{level.operatorData.value}</div>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', marginTop: '0.25rem' }}>
                DANGER: <span style={{ color: level.operatorData.danger === 'HIGH' ? '#ff3b5c' : level.operatorData.danger === 'MEDIUM' ? '#ffd60a' : '#00ff88' }}>{level.operatorData.danger}</span>
              </div>
            </div>
            {!level.silenced ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {['STATIC', 'SIGNAL', 'BREACH'].map((s) => (
                  <button key={s} onClick={() => setSignal(s)} style={{ flex: 1, padding: '0.6rem', background: signal === s ? '#00e5ff' : 'transparent', color: signal === s ? '#080c14' : '#e8f4f8', border: `1px solid ${signal === s ? '#00e5ff' : '#1a2d44'}`, fontFamily: 'Share Tech Mono', fontSize: '0.65rem', letterSpacing: '0.1em', cursor: 'pointer' }}>{s}</button>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', marginBottom: '1rem', textAlign: 'center' }}>⛔ SIGNALS DISABLED</div>
            )}
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.05em' }}>STATIC=LOW &nbsp;|&nbsp; SIGNAL=MEDIUM &nbsp;|&nbsp; BREACH=HIGH</div>
          </div>
        )}
        {role === 'analyst' && (
          <div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '1rem' }}>��� ROLE: ANALYST</div>
            <div style={{ border: '1px solid #1a2d44', padding: '1rem', background: '#080c14', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>SIGNAL FROM OPERATOR</div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color: signal ? '#ffd60a' : '#1a2d44', letterSpacing: '0.2em' }}>{signal || 'WAITING...'}</div>
            </div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.3em', marginBottom: '0.75rem' }}>// SELECT DEFENSE</div>
            {level.options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} disabled={!!selected || !!feedback} style={{ width: '100%', padding: '0.9rem', background: selected === opt ? '#00e5ff' : 'transparent', color: selected === opt ? '#080c14' : '#e8f4f8', border: `1px solid ${selected === opt ? '#00e5ff' : '#1a2d44'}`, fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.1em', cursor: selected || feedback ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginBottom: '0.5rem', boxShadow: selected === opt ? '0 0 20px rgba(0,229,255,0.3)' : 'none' }}
                onMouseEnter={e => { if (!selected && !feedback) e.currentTarget.style.borderColor = '#00e5ff'; }}
                onMouseLeave={e => { if (selected !== opt) e.currentTarget.style.borderColor = '#1a2d44'; }}
              >{opt}</button>
            ))}
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', marginTop: '0.5rem', letterSpacing: '0.05em' }}>STATIC=LOW &nbsp;|&nbsp; SIGNAL=MEDIUM &nbsp;|&nbsp; BREACH=HIGH</div>
          </div>
        )}
        <button onClick={() => setRole((r) => r === 'operator' ? 'analyst' : 'operator')} style={{ marginTop: '1.5rem', width: '100%', background: 'transparent', border: '1px solid #1a2d4466', color: '#4a648066', fontFamily: 'Share Tech Mono', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '0.4rem', cursor: 'pointer' }}>
          [DEV] SWITCH → {role === 'operator' ? 'ANALYST' : 'OPERATOR'}
        </button>
      </div>
    </div>
  );
}
