import React, { useEffect, useState } from 'react';
import { getLeaderboardAPI } from '../../../services/api';

const rankColor = (rank) => {
  if (rank === 1) return '#ffd60a';
  if (rank === 2) return '#e8f4f8';
  if (rank === 3) return '#ff8c42';
  return '#4a6480';
};

export default function LeaderboardTable() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadLeaderboard = async () => {
      setLoading(true);
      setError('');

      const data = await getLeaderboardAPI();
      if (!active) return;

      if (data.success) {
        setEntries(data.entries || []);
      } else {
        setError(data.message || 'Unable to load leaderboard');
      }

      setLoading(false);
    };

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="mobile-leaderboard-header" style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 60px', gap: '0.5rem', padding: '0 0.5rem 0.75rem', borderBottom: '1px solid #1a2d44', marginBottom: '0.5rem' }}>
        {['#', 'CALLSIGN', 'SCORE', 'GAMES'].map(header => (
          <div key={header} style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6480', letterSpacing: '0.2em' }}>{header}</div>
        ))}
      </div>

      {loading && (
        <div style={{ border: '1px solid #1a2d44', background: '#080c14', padding: '1.25rem', textAlign: 'center', fontFamily: 'Share Tech Mono', color: '#4a6480' }}>
          LOADING LEADERBOARD...
        </div>
      )}

      {!loading && error && (
        <div style={{ border: '1px solid #ff3b5c44', background: '#080c14', padding: '1.25rem', textAlign: 'center', fontFamily: 'Share Tech Mono', color: '#ff3b5c' }}>
          {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div style={{ border: '1px solid #1a2d44', background: '#080c14', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.2rem', fontWeight: 700, color: '#e8f4f8', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            NO LEADERBOARD DATA YET
          </div>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.72rem', color: '#4a6480', lineHeight: 1.7 }}>
            Finish a real match to create leaderboard entries.
          </div>
        </div>
      )}

      {!loading && !error && entries.map((entry, index) => (
        <div key={entry._id || entry.name} className="mobile-leaderboard-row" style={{
          display: 'grid', gridTemplateColumns: '40px 1fr 80px 60px',
          gap: '0.5rem', padding: '0.75rem 0.5rem',
          borderBottom: '1px solid #1a2d441a',
          background: index === 0 ? 'rgba(255,214,10,0.03)' : 'transparent',
        }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.2rem', fontWeight: 900, color: rankColor(index + 1) }}>
            {index + 1}
          </div>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.8rem', color: '#e8f4f8', letterSpacing: '0.05em' }}>{entry.name}</div>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.1rem', fontWeight: 700, color: '#00e5ff' }}>{entry.bestScore}</div>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: '#4a6480' }}>{entry.gamesPlayed}</div>
        </div>
      ))}
    </div>
  );
}
