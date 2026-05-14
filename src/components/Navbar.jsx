import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Rocket, BarChart2, Target, Home } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/predictor', label: 'Predictor', icon: Target },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(6,6,15,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(130,120,255,0.1)',
      padding: '0 28px',
      display: 'flex', alignItems: 'center', height: 60,
      gap: 8,
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', marginRight: 'auto',
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 20, color: '#fff', letterSpacing: '-0.02em',
        }}
      >
        <div style={{
          width: 34, height: 34,
          background: 'linear-gradient(135deg, #7c6bff, #a855f7)',
          borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Rocket size={17} color="#fff" />
        </div>
        BizGenius
      </div>

      {/* Links */}
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 16px', borderRadius: 9,
              background: active ? 'rgba(124,107,255,0.18)' : 'transparent',
              border: active ? '1px solid rgba(124,107,255,0.35)' : '1px solid transparent',
              color: active ? '#a895ff' : 'rgba(232,230,255,0.55)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#e8e6ff' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(232,230,255,0.55)' }}
          >
            <Icon size={15} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}