import React, { useEffect, useRef } from 'react';

export default function ControlRoomBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0, raf;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const waves = [
        { y: canvas.height * 0.25, amp: 18, freq: 3, color: '0,102,255',  speed: 0.018 },
        { y: canvas.height * 0.50, amp: 12, freq: 5, color: '255,0,51',   speed: 0.024 },
        { y: canvas.height * 0.75, amp: 22, freq: 2, color: '0,102,255',  speed: 0.012 },
      ];

      waves.forEach(w => {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = w.y + Math.sin((x / canvas.width) * Math.PI * 2 * w.freq + frame * w.speed) * w.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${w.color},0.055)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#010408' }}>

      {/* Base grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,102,255,0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,102,255,0.045) 1px, transparent 1px),
          linear-gradient(rgba(0,102,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,102,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px',
      }} />

      {/* Oscilloscope canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* SVG wires */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="wire-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="wire-glow-soft">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Blue flow */}
          <linearGradient id="flow-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#0066ff" stopOpacity="0"/>
            <stop offset="40%"  stopColor="#0066ff" stopOpacity="0.9"/>
            <stop offset="60%"  stopColor="#ff0033" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="flow-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#0066ff" stopOpacity="0"/>
            <stop offset="50%"  stopColor="#0066ff" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0"/>
          </linearGradient>

          {/* Conduit bodies */}
          <linearGradient id="conduit-h" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#0a1020"/>
            <stop offset="40%"  stopColor="#040812"/>
            <stop offset="100%" stopColor="#0a1020"/>
          </linearGradient>
          <linearGradient id="conduit-v" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#0a1020"/>
            <stop offset="40%"  stopColor="#040812"/>
            <stop offset="100%" stopColor="#0a1020"/>
          </linearGradient>

          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="transparent"/>
            <stop offset="100%" stopColor="#010408" stopOpacity="0.6"/>
          </radialGradient>
        </defs>

        {/* ── HORIZONTAL CONDUITS ── */}
        {[71, 355, 647].map((y, idx) => (
          <g key={idx} filter="url(#wire-glow)">
            <rect x="0" y={y - 3} width="1440" height="7" fill="url(#conduit-h)"/>
            <line x1="0" y1={y - 3} x2="1440" y2={y - 3} stroke="#0066ff" strokeWidth="0.8" strokeOpacity="0.4"/>
            <line x1="0" y1={y + 4} x2="1440" y2={y + 4} stroke="#000a22" strokeWidth="0.8"/>
            {Array.from({length: 72}).map((_, i) => (
              <line key={i} x1={i*20} y1={y-2} x2={i*20} y2={y+3} stroke="#0066ff" strokeWidth="0.5" strokeOpacity="0.15"/>
            ))}
            <rect x="0" y={y-2} width="90" height="5" fill="url(#flow-h)" opacity="0.7">
              <animateTransform attributeName="transform" type="translate"
                from="-90 0" to="1440 0" dur={`${2 + idx * 0.6}s`} repeatCount="indefinite"/>
            </rect>
          </g>
        ))}

        {/* ── VERTICAL CONDUITS ── */}
        {[120, 360, 720, 1080, 1320].map((x, idx) => (
          <g key={idx} filter="url(#wire-glow)">
            <rect x={x} y="0" width="7" height="900" fill="url(#conduit-v)"/>
            <line x1={x} y1="0" x2={x} y2="900" stroke="#0066ff" strokeWidth="0.8" strokeOpacity="0.3"/>
            <line x1={x+7} y1="0" x2={x+7} y2="900" stroke="#000a22" strokeWidth="0.8"/>
            {Array.from({length: 45}).map((_, i) => (
              <line key={i} x1={x+1} y1={i*20} x2={x+6} y2={i*20} stroke="#0066ff" strokeWidth="0.5" strokeOpacity="0.12"/>
            ))}
            <rect x={x+1} y="0" width="5" height="60" fill="url(#flow-v)" opacity="0.5">
              <animateTransform attributeName="transform" type="translate"
                from="0 -60" to="0 900" dur={`${2 + idx * 0.4}s`} repeatCount="indefinite"/>
            </rect>
          </g>
        ))}

        {/* ── JUNCTION NODES – alternating blue / red ── */}
        {[71, 355, 647].flatMap(y =>
          [120, 360, 720, 1080, 1320].map(x => ({ x, y }))
        ).map(({ x, y }, i) => {
          const color = i % 2 === 0 ? '#0066ff' : '#ff0033';
          return (
            <g key={i}>
              <circle cx={x+3.5} cy={y+0.5} r="10" fill="none" stroke={color} strokeWidth="0.5" opacity="0.25">
                <animate attributeName="r" values="8;14;8" dur={`${2.5+(i%4)*0.5}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur={`${2.5+(i%4)*0.5}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={x+3.5} cy={y+0.5} r="4.5" fill={color} filter="url(#wire-glow)">
                <animate attributeName="opacity" values="0.9;0.35;0.9" dur={`${3+(i%3)*0.7}s`} repeatCount="indefinite"/>
              </circle>
            </g>
          );
        })}

        {/* ── DIAGONAL ACCENT WIRES ── */}
        <g filter="url(#wire-glow-soft)" opacity="0.22">
          <path d="M 0 200 L 120 68"      stroke="#0066ff" strokeWidth="1.5" fill="none" strokeDasharray="4 8"/>
          <path d="M 0 290 L 120 68"      stroke="#0066ff" strokeWidth="1"   fill="none" strokeDasharray="2 12"/>
          <path d="M 1320 68 L 1440 170"  stroke="#0066ff" strokeWidth="1.5" fill="none" strokeDasharray="4 8"/>
          <path d="M 1320 352 L 1440 460" stroke="#0066ff" strokeWidth="1"   fill="none" strokeDasharray="2 12"/>
          <path d="M 360 352 L 720 355"   stroke="#ff0033" strokeWidth="1.2" fill="none" strokeDasharray="6 6"/>
          <path d="M 720 352 L 1080 355"  stroke="#ff0033" strokeWidth="1.2" fill="none" strokeDasharray="6 6"/>
        </g>

        {/* ── MINI CIRCUIT TRACES ── */}
        <g opacity="0.18" stroke="#0066ff" strokeWidth="1" fill="none">
          <path d="M 20 110 L 80 110 L 80 160 L 110 160"/>
          <path d="M 20 130 L 50 130 L 50 160"/>
          <circle cx="80" cy="110" r="3" fill="#0066ff"/>
          <circle cx="50" cy="130" r="2" fill="#0066ff"/>
          <path d="M 1260 700 L 1340 700 L 1340 760 L 1420 760"/>
          <path d="M 1300 720 L 1300 760"/>
          <circle cx="1340" cy="700" r="3" fill="#0066ff"/>
          <path d="M 20 420 L 90 420 L 90 470"/>
          <circle cx="90" cy="420" r="2" fill="#0066ff"/>
        </g>

        {/* ── CORNER BOLTS ── */}
        {[[8,8],[1424,8],[8,884],[1424,884],[128,8],[128,884],[1312,8],[1312,884]].map(([x,y],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#050812" stroke="#0066ff44" strokeWidth="1"/>
            <line x1={x-2} y1={y} x2={x+2} y2={y} stroke="#0066ff33" strokeWidth="0.8"/>
            <line x1={x} y1={y-2} x2={x} y2={y+2} stroke="#0066ff33" strokeWidth="0.8"/>
          </g>
        ))}

        {/* ── MINI READOUT PANELS ── */}
        <g opacity="0.3">
          <rect x="20" y="480" width="90" height="55" fill="#020510" stroke="#0066ff22" strokeWidth="1" rx="1"/>
          <line x1="20" y1="490" x2="110" y2="490" stroke="#0066ff33" strokeWidth="0.5"/>
          {[12,20,8,25,15,18,10].map((h,i) => (
            <rect key={i} x={26+i*11} y={520-h} width="7" height={h} fill="#0066ff" opacity="0.4" rx="1"/>
          ))}
          <text x="25" y="488" fill="#0066ff" fontSize="6" fontFamily="Share Tech Mono" opacity="0.7">SIG.MONITOR</text>
        </g>
        <g opacity="0.3">
          <rect x="1330" y="390" width="90" height="55" fill="#020510" stroke="#ff003322" strokeWidth="1" rx="1"/>
          <line x1="1330" y1="400" x2="1420" y2="400" stroke="#ff003333" strokeWidth="0.5"/>
          {[18,10,22,14,20,8].map((h,i) => (
            <rect key={i} x={1336+i*13} y={430-h} width="9" height={h} fill="#ff0033" opacity="0.35" rx="1"/>
          ))}
          <text x="1335" y="398" fill="#ff0033" fontSize="6" fontFamily="Share Tech Mono" opacity="0.7">NET.TRAFFIC</text>
        </g>

        <rect x="0" y="0" width="1440" height="900" fill="url(#vignette)"/>
      </svg>

      {/* Scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(0,102,255,0.15), transparent)',
        animation: 'scan-line 6s linear infinite',
        zIndex: 2,
      }}/>
    </div>
  );
}