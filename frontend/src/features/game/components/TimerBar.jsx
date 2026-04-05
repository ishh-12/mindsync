import React, { useEffect, useState } from 'react';

export default function TimerBar({ duration, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) {
        onExpire();
      }
      return;
    }

    const timer = setTimeout(() => setTimeLeft(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onExpire]);

  const pct = (timeLeft / duration) * 100;
  const color = timeLeft > duration * 0.5 ? '#00e5ff' : timeLeft > duration * 0.25 ? '#ffd60a' : '#ff3b5c';

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.2em' }}>TIME</span>
        <span style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900, color, lineHeight: 1 }}>{timeLeft}s</span>
      </div>
      <div style={{ height: '4px', background: '#1a2d44', width: '100%' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color,
          boxShadow: `0 0 8px ${color}`,
          transition: 'width 1s linear, background 0.3s',
        }} />
      </div>
    </div>
  );
}
