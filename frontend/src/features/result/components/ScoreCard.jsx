import React, { useEffect, useState } from 'react';

export default function ScoreCard({ score }) {
  const [displayed, setDisplayed] = useState(0);

  // Animate score counting up
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(score / 30);
    const t = setInterval(() => {
      current += step;
      if (current >= score) { setDisplayed(score); clearInterval(t); }
      else setDisplayed(current);
    }, 40);
    return () => clearInterval(t);
  }, [score]);

  const getRank = (s) => {
    if (s >= 80) return { label: 'S RANK', color: '#00e5ff' };
    if (s >= 60) return { label: 'A RANK', color: '#00ff88' };
    if (s >= 40) return { label: 'B RANK', color: '#ffd60a' };
    return { label: 'C RANK', color: '#ff3b5c' };
  };

  const rank = getRank(score);

  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
        MISSION COMPLETE
      </div>

      <div style={{
        fontFamily: 'Barlow Condensed', fontSize: '5rem', fontWeight: 900,
        color: '#e8f4f8', lineHeight: 1,
        textShadow: '0 0 30px rgba(0,229,255,0.3)',
      }}>
        {displayed}
      </div>

      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '1rem' }}>
        POINTS
      </div>

      <div style={{
        display: 'inline-block',
        fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 900,
        color: rank.color, letterSpacing: '0.2em',
        border: `1px solid ${rank.color}`,
        padding: '0.3rem 1.5rem',
        boxShadow: `0 0 20px ${rank.color}44`,
      }}>
        {rank.label}
      </div>
    </div>
  );
}