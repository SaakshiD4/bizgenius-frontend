import React from 'react'

// ─── Card ─────────────────────────────────────────────────────
export function Card({ children, style = {}, className = '', glow = false }) {
  return (
    <div
      className={`glass ${glow ? 'glow-purple' : ''} ${className}`}
      style={{ padding: 24, ...style }}
    >
      {children}
    </div>
  )
}

// ─── Section Title ─────────────────────────────────────────────
export function SectionTitle({ children, sub, style = {} }) {
  return (
    <div style={{ marginBottom: 20, ...style }}>
      <h2 style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 700,
        fontSize: 22, color: '#e8e6ff', letterSpacing: '-0.02em',
      }}>
        {children}
      </h2>
      {sub && <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

// ─── Badge ─────────────────────────────────────────────────────
export function Badge({ children, color = 'purple' }) {
  const MAP = {
    purple: { bg: 'rgba(124,107,255,0.15)', text: '#a895ff', border: 'rgba(124,107,255,0.3)' },
    green:  { bg: 'rgba(52,211,153,0.12)', text: '#34d399',  border: 'rgba(52,211,153,0.3)' },
    red:    { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.3)' },
    yellow: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24',  border: 'rgba(251,191,36,0.3)' },
    cyan:   { bg: 'rgba(0,229,255,0.1)',   text: '#00e5ff',  border: 'rgba(0,229,255,0.25)' },
    pink:   { bg: 'rgba(251,113,133,0.12)', text: '#fb7185', border: 'rgba(251,113,133,0.3)' },
  }
  const c = MAP[color] || MAP.purple
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-block',
    }}>
      {children}
    </span>
  )
}

// ─── MetricCard ────────────────────────────────────────────────
export function MetricCard({ label, value, sub, icon, color = '#7c6bff', delay = 0 }) {
  return (
    <div
      className="glass"
      style={{
        padding: '20px 24px', borderLeft: `3px solid ${color}`,
        animation: `fadeUp 0.5s ease ${delay}s both`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 8 }}>
            {label}
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>}
        </div>
        {icon && (
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PrimaryButton ─────────────────────────────────────────────
export function PrimaryButton({ children, onClick, loading = false, disabled = false, style = {}, full = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: '12px 28px',
        background: disabled ? 'rgba(124,107,255,0.2)' : 'linear-gradient(135deg, #7c6bff, #a855f7)',
        color: disabled ? 'rgba(232,230,255,0.4)' : '#fff',
        borderRadius: 10, fontWeight: 700, fontSize: 14,
        fontFamily: 'DM Sans, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        boxShadow: disabled ? 'none' : '0 4px 20px rgba(124,107,255,0.35)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: full ? '100%' : 'auto',
        transition: 'all 0.2s ease',
        ...style,
      }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : null}
      {children}
    </button>
  )
}

// ─── GhostButton ───────────────────────────────────────────────
export function GhostButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        background: 'transparent',
        color: 'var(--text2)',
        border: '1px solid var(--border2)',
        borderRadius: 9, fontWeight: 500, fontSize: 13,
        fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 7,
        transition: 'all 0.2s',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(124,107,255,0.1)'
        e.currentTarget.style.color = 'var(--text)'
        e.currentTarget.style.borderColor = 'rgba(124,107,255,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--text2)'
        e.currentTarget.style.borderColor = 'var(--border2)'
      }}
    >
      {children}
    </button>
  )
}

// ─── Spinner (full screen) ─────────────────────────────────────
export function FullSpinner({ label = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 300, gap: 16,
    }}>
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      <p style={{ color: 'var(--text2)', fontSize: 14 }}>{label}</p>
    </div>
  )
}

// ─── Alert Box ─────────────────────────────────────────────────
export function AlertBox({ type = 'info', children }) {
  const MAP = {
    info:    { border: '#7c6bff', bg: 'rgba(124,107,255,0.08)', icon: 'ℹ️' },
    success: { border: '#34d399', bg: 'rgba(52,211,153,0.08)',  icon: '✅' },
    warning: { border: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  icon: '⚠️' },
    error:   { border: '#f87171', bg: 'rgba(248,113,113,0.08)', icon: '❌' },
  }
  const c = MAP[type]
  return (
    <div style={{
      background: c.bg, borderLeft: `3px solid ${c.border}`,
      borderRadius: 8, padding: '12px 16px',  // ✅ FIXED: was var(--radius-sm, 8)
      display: 'flex', alignItems: 'flex-start', gap: 10,
      fontSize: 13, color: 'var(--text2)',
    }}>
      <span>{c.icon}</span>
      <span>{children}</span>
    </div>
  )
}

// ─── Tab Bar ───────────────────────────────────────────────────
export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      background: 'var(--surface)', borderRadius: 12, padding: 5,
      border: '1px solid var(--border)',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, padding: '9px 18px', borderRadius: 9,
            background: active === tab.id ? 'linear-gradient(135deg, #7c6bff, #a855f7)' : 'transparent',
            color: active === tab.id ? '#fff' : 'var(--text2)',
            border: 'none', fontWeight: 600, fontSize: 13,
            fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
            transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            boxShadow: active === tab.id ? '0 4px 14px rgba(124,107,255,0.3)' : 'none',
          }}
        >
          {tab.icon && <span style={{ marginRight: 6 }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ─── Progress Bar ──────────────────────────────────────────────
export function ProgressBar({ value, color = '#7c6bff', label, showPct = true }) {
  return (
    <div>
      {(label || showPct) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          {label && <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>}
          {showPct && <span style={{ fontSize: 12, fontWeight: 700, color }}>{value.toFixed(1)}%</span>}
        </div>
      )}
      <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${Math.min(100, Math.max(0, value))}%`,
          background: color, borderRadius: 999,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  )
}

// ─── Divider ───────────────────────────────────────────────────
export function Divider({ style = {} }) {
  return <div style={{ height: 1, background: 'var(--border)', margin: '24px 0', ...style }} />
}