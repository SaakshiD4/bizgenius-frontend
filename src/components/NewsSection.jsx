import React, { useState, useEffect } from 'react'
import { ExternalLink, Clock, RefreshCw } from 'lucide-react'
import { getNews } from '../services/api.js'
import { FullSpinner } from './UI.jsx'

const DOMAIN_EMOJIS = {
  EdTech: '📚', FinTech: '💳', HealthTech: '🏥',
  'E-commerce': '🛒', SaaS: '☁️', FoodTech: '🍔',
  AgriTech: '🌾', CleanTech: '🌱', IoT: '🔌',
  'AI/ML': '🤖', Other: '🚀',
}

function timeAgo(iso) {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const hrs = Math.floor(diff / 36e5)
    if (hrs < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  } catch { return '' }
}

export default function NewsSection({ domain, visible, onToggle }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const emoji = DOMAIN_EMOJIS[domain] || '🚀'

  useEffect(() => {
    if (!visible) return
    setLoading(true); setError(null)
    getNews(domain)
      .then(res => setArticles(res.articles || []))
      .catch(e => setError(e.message || 'Failed to load news'))
      .finally(() => setLoading(false))
  }, [domain, visible])

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d24 0%, #111130 50%, #0a1f3c 100%)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 8,
        border: '1px solid rgba(124,107,255,0.15)',
        boxShadow: '0 4px 24px rgba(15,30,80,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ color: '#818cf8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4, fontWeight: 700 }}>
              LIVE INDUSTRY INTELLIGENCE
            </div>
            <div style={{ color: 'white', fontSize: 18, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
              {emoji} What's happening in <span style={{ color: '#818cf8' }}>{domain}</span> right now?
            </div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
              Trending news, funding rounds, market shifts — click to explore
            </div>
          </div>
          <button
            onClick={onToggle}
            style={{
              padding: '10px 22px', borderRadius: 10, fontWeight: 700, fontSize: 13,
              background: visible ? 'rgba(248,113,133,0.15)' : 'rgba(124,107,255,0.2)',
              color: visible ? '#fb7185' : '#a895ff',
              border: `1px solid ${visible ? 'rgba(248,113,133,0.3)' : 'rgba(124,107,255,0.35)'}`,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {visible ? '🙈 Hide News' : `📰 See ${domain} News`}
          </button>
        </div>
      </div>

      {/* Articles */}
      {visible && (
        <div style={{ animation: 'fadeUp 0.35s ease both' }}>
          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

          {loading && <FullSpinner label={`Fetching ${domain} news...`} />}

          {error && (
            <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, padding: 20, textAlign: 'center', color: 'var(--text2)', fontSize: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>⚠️</div>
              <div style={{ fontWeight: 700, color: '#f87171', marginBottom: 6 }}>Could not load news</div>
              <div style={{ fontSize: 12 }}>{error}</div>
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text3)' }}>Make sure <code>NEWS_API_KEY</code> is set in your backend .env</div>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: 32, fontSize: 14 }}>
              No recent articles found for {domain}.
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', display: 'inline-block' }} />
                <span style={{ fontSize: 13, color: '#34d399', fontWeight: 600 }}>{articles.length} recent articles</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                {articles.map((a, i) => (
                  <div
                    key={i}
                    className="glass"
                    style={{
                      padding: '16px 18px', borderRadius: 14, borderLeft: '3px solid #7c6bff',
                      animation: `fadeUp 0.35s ease ${i * 0.05}s both`,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,107,255,0.15)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ background: 'rgba(124,107,255,0.15)', color: '#a895ff', borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                        📰 {a.source}
                      </span>
                      <span style={{ color: 'var(--text3)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={10} /> {timeAgo(a.published)}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 7, lineHeight: 1.45 }}>
                      {a.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55, marginBottom: 12 }}>
                      {(a.description || '').slice(0, 140)}{(a.description || '').length > 140 ? '...' : ''}
                    </div>
                    <a
                      href={a.url} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: '#7c6bff', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                    >
                      Read full article <ExternalLink size={11} />
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
        </div>
      )}
    </div>
  )
}