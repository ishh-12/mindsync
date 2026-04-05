import React from 'react';

export default function OptionButton({ value, onClick, selected, disabled }) {
  return (
    <button onClick={() => !disabled && onClick(value)} style={{
      width: '100%', padding: '0.9rem',
      background: selected ? '#00e5ff' : 'transparent',
      color: selected ? '#080c14' : '#e8f4f8',
      border: `1px solid ${selected ? '#00e5ff' : '#1a2d44'}`,
      fontFamily: 'Barlow Condensed', fontWeight: 700,
      fontSize: '1.3rem', letterSpacing: '0.1em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s', marginBottom: '0.5rem',
      boxShadow: selected ? '0 0 20px rgba(0,229,255,0.3)' : 'none',
    }}
      onMouseEnter={e => { if (!selected && !disabled) e.currentTarget.style.borderColor = '#00e5ff'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = '#1a2d44'; }}
    >{value}</button>
  );
}