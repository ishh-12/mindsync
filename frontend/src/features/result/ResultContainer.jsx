import React from 'react';
import { useLocation } from 'react-router-dom';
import ScoreCard from './components/ScoreCard';
import ReplayButton from './components/ReplayButton';

export default function ResultContainer() {
  const location = useLocation();
  const score = location.state?.score ?? 0;

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

      <div style={{
        border: '1px solid #1a2d44', padding: '2.5rem',
        background: '#0d1421', maxWidth: '420px', width: '100%',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#00e5ff' }} />

        <div style={{ fontFamily: 'Share Tech Mono', color: '#00e5ff', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
          // DEBRIEF
        </div>

        <ScoreCard score={score} />

        {/* Score breakdown */}
        <div style={{ border: '1px solid #1a2d44', padding: '1rem', marginBottom: '2rem', background: '#080c14' }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
            SCORING GUIDE
          </div>
          {[
            { label: 'CORRECT ANSWER', val: '+10', color: '#00ff88' },
            { label: 'WRONG ANSWER', val: '-5', color: '#ff3b5c' },
            { label: 'TIME UP', val: '-5', color: '#ff3b5c' },
            { label: 'FINAL LEVEL BONUS', val: '+20', color: '#ffd60a' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#4a6480' }}>{row.label}</span>
              <span style={{ fontFamily: 'Barlow Condensed', fontSize: '0.9rem', fontWeight: 700, color: row.color }}>{row.val}</span>
            </div>
          ))}
        </div>

        <ReplayButton />
      </div>
    </div>
  );
}