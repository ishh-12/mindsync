import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SparkLine({ color = '#00ff41', width = 60, height = 18 }) {
  const [points, setPoints] = useState(() => Array.from({length: 20}, () => Math.random()));
  useEffect(() => {
    const id = setInterval(() => setPoints(p => [...p.slice(1), Math.random()]), 180);
    return () => clearInterval(id);
  }, []);
  const step = width / (points.length - 1);
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - v * (height - 2) - 1}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" opacity="0.7"/>
    </svg>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [time, setTime] = useState('');
  const [ping, setPing] = useState(12);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
      setPing(Math.floor(Math.random() * 8) + 8);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const ticker = '› SYS:ONLINE  › ENCRYPTION:AES-256  › NEXUS.THREAT:ACTIVE  › PLAYERS.CONNECTED:0  › ROOMS.OPEN:0  › UPTIME:99.8%  › SIGNAL:CLEAN  › FIREWALL:ARMED  ';

  return (
    <>
      {/* Status ticker strip */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 101,
        height: '20px', background: '#010804',
        borderBottom: '1px solid #00ff4111',
        overflow: 'hidden', display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: 'Share Tech Mono', fontSize: '0.58rem',
          color: '#004d12', letterSpacing: '0.12em',
          whiteSpace: 'nowrap',
          animation: 'ticker 22s linear infinite',
        }}>
          {ticker}{ticker}
        </div>
      </div>

      {/* Main nav */}
      <nav style={{
        position: 'fixed', top: '20px', left: 0, right: 0, zIndex: 100,
        background: 'rgba(1,8,4,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #00ff4133',
      }}>
        {/* Top conduit */}
        <div style={{ position: 'relative', height: '6px', background: 'linear-gradient(180deg,#0d2010,#041208,#0d2010)', borderBottom: '1px solid #00ff4122', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '1px 0', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(0,255,65,0.18) 18px, rgba(0,255,65,0.18) 20px)' }}/>
          <div style={{ position: 'absolute', top: '1px', bottom: '1px', width: '80px', background: 'linear-gradient(90deg,transparent,rgba(0,255,65,0.5),transparent)', animation: 'data-flow-h 1.8s linear infinite' }}/>
        </div>

        <div style={{ padding: '0.5rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left – Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* LED cluster */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {['#00ff41','#ffcc00','#ff0033'].map((c,i) => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: i === 0 ? c : `${c}33`,
                  boxShadow: i === 0 ? `0 0 6px ${c}` : 'none',
                  animation: i === 0 ? 'led-blink 2s infinite' : 'none',
                }}/>
              ))}
            </div>
            {/* Wordmark */}
            <div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 900, color: '#00ff41', letterSpacing: '0.2em', textShadow: '0 0 12px #00ff4188' }}>
                MIND<span style={{ color: '#00e5ff', textShadow: '0 0 12px #00e5ff88' }}>SYNC</span>
              </div>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.48rem', color: '#004d12', letterSpacing: '0.3em' }}>
                CONTROL ROOM CHAOS v2.1
              </div>
            </div>
          </div>

          {/* Center – Sparklines */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {[['#00ff41','SIGNAL.A'],['#00e5ff','SIGNAL.B']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <SparkLine color={color} width={70} height={18}/>
                <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.5rem', color: '#004d12', letterSpacing: '0.1em' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Right – Clock + ping + button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'VT323', fontSize: '1.3rem', color: '#00ff41', letterSpacing: '0.1em', textShadow: '0 0 8px #00ff4166', lineHeight: 1 }}>{time}</div>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.5rem', color: '#004d12', letterSpacing: '0.1em' }}>PING: {ping}ms</div>
            </div>
            <button
              onClick={() => navigate('/leaderboard')}
              style={{
                background: 'transparent', border: '1px solid #00ff4144',
                color: '#005514', padding: '0.35rem 0.9rem',
                fontFamily: 'Share Tech Mono', cursor: 'pointer',
                fontSize: '0.65rem', letterSpacing: '0.12em',
                position: 'relative', overflow: 'hidden', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#00ff41'; e.currentTarget.style.color='#00ff41'; e.currentTarget.style.boxShadow='0 0 12px #00ff4133'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#00ff4144'; e.currentTarget.style.color='#005514'; e.currentTarget.style.boxShadow='none'; }}
            >
              ⬡ LEADERBOARD
            </button>
          </div>
        </div>

        {/* Bottom conduit */}
        <div style={{ position: 'relative', height: '4px', background: 'linear-gradient(180deg,#041208,#0d2010)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '1px', bottom: '1px', width: '60px', background: 'linear-gradient(90deg,transparent,rgba(0,229,255,0.4),transparent)', animation: 'data-flow-h 2.4s linear infinite' }}/>
        </div>
      </nav>
    </>
  );
}