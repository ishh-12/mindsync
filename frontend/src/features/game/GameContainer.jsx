import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TimerBar from './components/TimerBar';
import AnalystView from './components/AnalystView';
import OperatorView from './components/OperatorView';

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

export default function GameContainer() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [levelIdx, setLevelIdx] = useState(0);
const [role, setRole] = useState('operator');
const [selected, setSelected] = useState(null);
const [score, setScore] = useState(0);
const [signal, setSignal] = useState(null);
const [feedback, setFeedback] = useState(null);
  



    const syncRoomState = async () => {
      console.log('GAME JOIN EMIT:', { roomCode, playerName });
      socket.emit('join_room', {
        roomCode,
        name: playerName,
      });

      const data = await getRoomAPI(roomCode);
      console.log('GAME ROOM FETCH:', { roomCode, success: data.success, data });
      if (!active || !data.success) return;

      const room = data.data;
      const currentPlayer = (room.players || []).find((player) => player.name === playerName);
      if (!currentPlayer) return;

      setRole(currentPlayer.role || null);
      setLevel(room.level || 1);
      setScore(room.score || 0);
    };

    syncRoomState();

    return () => {
      active = false;
    };
}
   [roomCode, playerName];

  useEffect(() => {
    const onLevelData = (data) => {
      setRole(data.role);
      setLevel(data.level || 1);
      setClue(data.hint || data.clue || 'Waiting for clue...');
      setIsCorrupted(Boolean(data.isCorrupted) && data.role === 'analyst');
      setOptions(data.options || []);
      setSelected(null);
      setFeedback(null);
      setSignal(null);
    };

    const onTimerStart = (data) => {
      setTimerDuration(data.time || 15);
      setTimerKey((value) => value + 1);
    };

    const onReceiveSignal = (payload) => {
      setSignal(payload?.signal || payload);
    };

    const onResult = (data) => {
      setScore(data.score ?? 0);
      setLevel(data.level ?? 1);
      setIsCorrupted(false);
      setFeedback(data.correct ? 'CORRECT' : 'WRONG');
      setSelected(null);

      if (role === 'analyst') {
        setTimeout(() => {
          socket.emit('start_level', { roomCode });
        }, 1200);
      }
    };

    const onTimeUp = (data) => {
      setIsCorrupted(false);
      setFeedback(data.message || 'TIME UP');
      if (typeof data.score === 'number') {
        setScore(data.score);
      }
      if (typeof data.level === 'number') {
        setLevel(data.level);
      }

      if (role === 'analyst' && typeof data.level === 'number' && data.level <= 6) {
        setTimeout(() => {
          socket.emit('start_level', { roomCode });
        }, 1200);
      }
    };

    const onGameOver = (data) => {
      navigate('/result', {
        state: {
          score: data.score ?? 0,
        },
      });
    };

    const onError = (message) => {
      alert(message);
    };

    socket.on('level_data', onLevelData);
    socket.on('timer_start', onTimerStart);
    socket.on('receive_signal', onReceiveSignal);
    socket.on('result', onResult);
    socket.on('time_up', onTimeUp);
    socket.on('game_over', onGameOver);
    socket.on('error', onError);
    setIsSocketReady(true);

    return () => {
      setIsSocketReady(false);
      socket.off('level_data', onLevelData);
      socket.off('timer_start', onTimerStart);
      socket.off('receive_signal', onReceiveSignal);
      socket.off('result', onResult);
      socket.off('time_up', onTimeUp);
      socket.off('game_over', onGameOver);
      socket.off('error', onError);
    };
  }, [roomCode, role, navigate]);

  useEffect(() => {
    if (role === 'analyst' && isSocketReady) {
      console.log('START LEVEL EMIT:', { roomCode, role, playerName });
      socket.emit('start_level', { roomCode });
    }
  }, [isSocketReady, roomCode, role, playerName]);

  
const handleSelect = (val) => {
  if (selected || feedback) return;

  setSelected(val);

  const correct = val === level.answer;
  const bonus = levelIdx === 4 ? 15 : levelIdx === 5 ? 20 : 0;
  const pts = correct ? 10 + bonus : -5;

  setScore((s) => s + pts);
  setFeedback(correct ? '✓ SURVIVED' : '✗ COMPROMISED');

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

  const handleExpire = () => {
    if (feedback) return;
    setScore(s => s - 5);
    setFeedback('✗ TIME UP — THEY GOT IN');
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setSignal(null);
      if (levelIdx < LEVELS.length - 1) setLevelIdx(i => i + 1);
      else navigate('/result', { state: { score: score - 5 } });
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
      {/* Background */}
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
        {/* Top accent line */}
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

        {/* Corruption warning */}
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

        {/* Silenced warning */}
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

        {/* Feedback */}
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


        {role === 'analyst'
          ? <AnalystView clue={clue} isCorrupted={isCorrupted} onSignal={handleSignal} lastSignal={signal} />
          : <OperatorView options={options} onSelect={handleSelect} selected={selected} onSignal={handleSignal} lastSignal={signal} />
        }
{/* OPERATOR VIEW */}
{role === 'operator' && (
  <div>
    <div style={{ fontSize: '0.7rem', marginBottom: '1rem' }}>
      💀 ROLE: OPERATOR
    </div>

    <h3>{level.operatorData.label}</h3>
    <h1>{level.operatorData.value}</h1>
    <p>DANGER: {level.operatorData.danger}</p>

    {!level.silenced ? (
      <div>
        <button onClick={() => setSignal('STATIC')}>STATIC</button>
        <button onClick={() => setSignal('SIGNAL')}>SIGNAL</button>
        <button onClick={() => setSignal('BREACH')}>BREACH</button>
      </div>
    ) : (
      <p>⛔ SIGNALS DISABLED</p>
    )}
  </div>
)}

{/* ANALYST VIEW */}
{role === 'analyst' && (
  <div>
    <div>🧠 ROLE: ANALYST</div>

    <h3>Signal: {signal || 'WAITING...'}</h3>

    

            {/* Signal received */}
            <div style={{
              border: '1px solid #1a2d44', padding: '1rem',
              background: '#080c14', marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
                SIGNAL FROM OPERATOR
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color: signal ? '#ffd60a' : '#1a2d44', letterSpacing: '0.2em' }}>
                {signal || 'WAITING...'}
              </div>
            </div>

            {/* Options */}
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