import React from 'react';

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 2, marginTop: '4rem' }}>
      {/* Top conduit */}
      <div style={{ position: 'relative', height: '6px', background: 'linear-gradient(180deg,#11243a,#08111f,#11243a)', borderTop: '1px solid #00e5ff33', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '1px 0', backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 18px,rgba(0,229,255,0.15) 18px,rgba(0,229,255,0.15) 20px)' }}/>
        <div style={{ position: 'absolute', top:'1px', bottom:'1px', width:'80px', background:'linear-gradient(90deg,transparent,rgba(0,229,255,0.4),transparent)', animation:'data-flow-h 2.2s linear infinite' }}/>
      </div>

      <div style={{ padding: '2rem', background: 'rgba(5,12,20,0.9)', borderTop: '1px solid #00e5ff11' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {['#00e5ff','#8bd3ff','#4a6480'].map((c,i) => (
                <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:c, opacity: i===0?1:0.3, boxShadow: i===0?`0 0 4px ${c}`:'none' }}/>
              ))}
            </div>
            <span style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', fontWeight: 900, color: '#8bd3ff', letterSpacing: '0.25em' }}>⚔ MINDSYNC</span>
          </div>

          {/* Center info */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.6rem', color: '#4a6480', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              CONTROL ROOM CHAOS &nbsp;│&nbsp; MERN STACK &nbsp;│&nbsp; ZOMBIE APOCALYPSE EDITION
            </div>
            {/* Mini bar chart */}
            <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', alignItems: 'flex-end', height: '12px' }}>
              {[4,7,3,9,5,8,6,4,7,5].map((h,i) => (
                <div key={i} style={{ width:'4px', height:`${h}px`, background:'#00e5ff', opacity:0.2+(h/9)*0.3 }}/>
              ))}
            </div>
          </div>

          {/* Right status */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.6rem', color: '#8aa0b8', letterSpacing: '0.1em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#00e5ff', boxShadow:'0 0 6px #00e5ff', animation:'led-blink 2s infinite' }}/>
              SYS:ONLINE
            </div>
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.52rem', color: '#4a6480', letterSpacing: '0.08em' }}>ALL SYSTEMS NOMINAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
}