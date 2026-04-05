import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import TimerBar from './components/TimerBar';
import AnalystView from './components/AnalystView';
import OperatorView from './components/OperatorView';
import socket from '../../services/socket';
import { getRoomAPI } from '../../services/api';

export default function GameContainer() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('name') || location.state?.currentPlayerName || 'PLAYER';
  const initialPlayers = location.state?.players || [];
  const initialMatch = initialPlayers.find((player) => player.name === playerName);

  const [role, setRole] = useState(initialMatch?.role || null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [signal, setSignal] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [selected, setSelected] = useState(null);
  const [clue, setClue] = useState('Waiting for level...');
  const [options, setOptions] = useState([]);
  const [timerDuration, setTimerDuration] = useState(15);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    let active = true;

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
  }, [roomCode, playerName]);

  useEffect(() => {
    if (role === 'analyst') {
      console.log('START LEVEL EMIT:', { roomCode, role, playerName });
      socket.emit('start_level', { roomCode });
    }
  }, [roomCode, role, playerName]);

  useEffect(() => {
    const onLevelData = (data) => {
      setRole(data.role);
      setLevel(data.level || 1);
      setClue(data.clue || 'Waiting for clue...');
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
      setFeedback(data.correct ? 'CORRECT' : 'WRONG');
      setSelected(null);

      if (role === 'analyst') {
        setTimeout(() => {
          socket.emit('start_level', { roomCode });
        }, 1200);
      }
    };

    const onTimeUp = (data) => {
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

    return () => {
      socket.off('level_data', onLevelData);
      socket.off('timer_start', onTimerStart);
      socket.off('receive_signal', onReceiveSignal);
      socket.off('result', onResult);
      socket.off('time_up', onTimeUp);
      socket.off('game_over', onGameOver);
      socket.off('error', onError);
    };
  }, [roomCode, role, navigate]);

  const handleSelect = (value) => {
    setSelected(value);
    socket.emit('select_option', {
      roomCode,
      option: value,
    });
  };

  const handleSignal = (value) => {
    socket.emit('send_signal', {
      roomCode,
      signal: value,
    });
  };

  if (!role) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'Share Tech Mono', color: '#00e5ff', letterSpacing: '0.2em' }}>SYNCING GAME...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      <div style={{ border: '1px solid #1a2d44', padding: '2rem', background: '#0d1421', maxWidth: '420px', width: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>
              LEVEL {level}/6
            </div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.2rem', fontWeight: 900, color: '#e8f4f8', letterSpacing: '0.1em' }}>
              ROOM {roomCode}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>SCORE</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color: '#00e5ff' }}>{score}</div>
          </div>
        </div>

        <TimerBar key={timerKey} duration={timerDuration} />

        {feedback && (
          <div style={{
            textAlign: 'center', padding: '0.75rem',
            fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900,
            color: feedback === 'CORRECT' ? '#00ff88' : '#ff3b5c',
            letterSpacing: '0.2em', marginBottom: '1rem',
            border: `1px solid ${feedback === 'CORRECT' ? '#00ff88' : '#ff3b5c'}`,
          }}>{feedback}</div>
        )}

        {role === 'analyst'
          ? <AnalystView clue={clue} isCorrupted={false} onSignal={handleSignal} lastSignal={signal} />
          : <OperatorView options={options} onSelect={handleSelect} selected={selected} onSignal={handleSignal} lastSignal={signal} />
        }
      </div>
    </div>
  );
}
