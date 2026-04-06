import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import RoomCode from './components/RoomCode';
import PlayerList from './components/PlayerList';
import StartButton from './components/StartButton';
import socket from '../../services/socket';

export default function LobbyContainer() {
  const { roomCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const name = searchParams.get('name') || 'PLAYER';
  const isHost = searchParams.get('host') === 'true';
  const [players, setPlayers] = useState([]);
  const joinedKeyRef = useRef('');

  useEffect(() => {
    setPlayers([]);

    const joinKey = `${roomCode}:${name}`;
    if (joinedKeyRef.current !== joinKey) {
      joinedKeyRef.current = joinKey;
      console.log('LOBBY JOIN EMIT:', { roomCode, name, isHost });
      socket.emit('join_room', {
        roomCode,
        name,
      });
    }

    const onRoomUpdate = (room) => {
      const mappedPlayers = (room.players || []).map((player, index) => ({
        name: player.name,
        role: player.role,
        isHost: index === 0,
      }));
      setPlayers(mappedPlayers);
    };

    const onGameStarted = (data) => {
      console.log('GAME STARTED EVENT:', data);
      navigate(`/game/${roomCode}?name=${encodeURIComponent(name)}`, {
        state: {
          players: data.players,
          currentPlayerName: name,
        },
      });
    };

    const onError = (message) => {
      alert(message);
    };

    socket.on('room_update', onRoomUpdate);
    socket.on('game_started', onGameStarted);
    socket.on('error', onError);

    return () => {
      socket.off('room_update', onRoomUpdate);
      socket.off('game_started', onGameStarted);
      socket.off('error', onError);
    };
  }, [roomCode, name, navigate]);

  const handleStart = () => {
    console.log('START GAME EMIT:', { roomCode, name });
    socket.emit('start_game', { roomCode });
  };

  const canStart = players.length === 2 && isHost;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '2rem',
    }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      <div style={{ border: '1px solid #1a2d44', padding: '2.5rem', background: '#0d1421', maxWidth: '420px', width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#00e5ff' }} />

        <div style={{ fontFamily: 'Share Tech Mono', color: '#00e5ff', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
          {'// STAGING AREA'}
        </div>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', fontWeight: 900, color: '#e8f4f8', marginBottom: '2rem' }}>
          LOBBY
        </h2>

        <RoomCode code={roomCode} />
        <PlayerList players={players} />
        <StartButton canStart={canStart} isHost={isHost} onStart={handleStart} />
      </div>
    </div>
  );
}
