import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { BarChart2, Target, Rocket, FileText, Download } from 'lucide-react'
import { generateReport, generatePitch } from '../services/api'

const FEATURES = [
  {
    icon: '🎨',
    title: 'Analytics Dashboard',
    color: '#7c6bff',
    items: [
      'Synthetic dataset visualisations',
      'Interactive segment filters',
      'Advanced charts & heatmaps',
      'City-Industry metrics',
    ],
  },
  {
    icon: '🤖',
    title: 'AI Predictor',
    color: '#a855f7',
    items: [
      'Real ML dataset predictions',
      'Trained model accuracy',
      'ChromaDB RAG competitors',
      'LLM strategic insights',
    ],
  },
  {
    icon: '📰',
    title: 'Live News Feed',
    color: '#00e5ff',
    items: [
      'Domain-aware news queries',
      'NewsAPI real-time articles',
      'Expandable news cards',
      'Hourly cache per domain',
    ],
  },
]

const STATS = [
  { label: 'Startups Analysed', value: '12,000+' },
  { label: 'Prediction Accuracy', value: '89%' },
  { label: 'Industries Covered', value: '11' },
  { label: 'AI Models Used', value: '3' },
]

// ─── Trigger a browser file download from a Blob ─────────────
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function HomePage() {
  const navigate = useNavigate()

  // ── Read predictor results that PredictorPage saved to localStorage ──
  // PredictorPage must save its results like:
  //   localStorage.setItem('bizgenius_results', JSON.stringify({
  //     user_input, ml_results, analysis, competitors, hierarchy, probable_risks
  //   }))
  const [savedResults, setSavedResults] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [pitchLoading, setPitchLoading] = useState(false)
  const [reportError, setReportError] = useState(null)
  const [pitchError, setPitchError] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('bizgenius_results')
      if (raw) setSavedResults(JSON.parse(raw))
    } catch {
      // corrupted storage — ignore
    }
  }, [])

  const hasResults = Boolean(savedResults)

  // ── Download PDF Report ──────────────────────────────────────
  const handleDownloadReport = async () => {
    if (!hasResults) { navigate('/predictor'); return }
    setReportLoading(true); setReportError(null)
    try {
      // ↓ destructure hiring_guide too
      const { user_input, ml_results, analysis, competitors, hierarchy, probable_risks, hiring_guide } = savedResults
      const blob = await generateReport({
        user_input, ml_results, analysis, competitors,
        hierarchy, probable_risks,
        hiring_guide: hiring_guide || {},   // ← ADD
      })
      triggerDownload(blob, 'bizgenius_report.pdf')
    } catch (err) {
      setReportError(err.message || 'Failed to generate report')
    } finally { setReportLoading(false) }
}

  // ── Download Pitch Deck ──────────────────────────────────────
  const handleDownloadPitch = async () => {
    if (!hasResults) { navigate('/predictor'); return }
    setPitchLoading(true); setPitchError(null)
    try {
      const { user_input, ml_results, analysis, competitors, hierarchy, probable_risks, hiring_guide } = savedResults
      const blob = await generatePitch({
        user_input, ml_results, analysis, competitors,
        hierarchy, probable_risks,
        hiring_guide: hiring_guide || {},   // ← ADD
      })
      triggerDownload(blob, 'bizgenius_pitch.pptx')
    } catch (err) {
      setPitchError(err.message || 'Failed to generate pitch deck')
    } finally { setPitchLoading(false) }
}

  return (
    <div style={{ minHeight: '100vh', paddingTop: 60 }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="grid-bg"
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,107,255,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', right: '30%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', maxWidth: 820, padding: '0 24px', position: 'relative', zIndex: 1 }}>

          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(124,107,255,0.1)', border: '1px solid rgba(124,107,255,0.25)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 32,
            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a895ff',
            animation: 'fadeUp 0.5s ease both',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', display: 'inline-block' }} />
            Startup Intelligence Platform
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(42px, 7vw, 78px)', lineHeight: 1.05,
            letterSpacing: '-0.04em', marginBottom: 24,
            animation: 'fadeUp 0.5s ease 0.1s both',
          }}>
            <span style={{ color: '#fff' }}>Know Before</span>
            <br />
            <span className="gradient-text">You Launch</span>
          </h1>

          <p style={{
            fontSize: 19, color: 'var(--text2)', lineHeight: 1.7,
            maxWidth: 600, margin: '0 auto 48px',
            animation: 'fadeUp 0.5s ease 0.2s both',
          }}>
            AI-powered startup success prediction, ecosystem analytics, real-time competitor intelligence, and team hierarchy planning — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeUp 0.5s ease 0.3s both',
          }}>
            <button
              onClick={() => navigate('/analytics')}
              style={{
                padding: '15px 36px', borderRadius: 12, fontWeight: 700, fontSize: 16,
                background: 'linear-gradient(135deg, #7c6bff, #a855f7)',
                color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(124,107,255,0.4)',
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 0.2s ease', fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <BarChart2 size={19} /> Ecosystem Analytics
            </button>
            <button
              onClick={() => navigate('/predictor')}
              style={{
                padding: '15px 36px', borderRadius: 12, fontWeight: 700, fontSize: 16,
                background: 'transparent',
                color: '#fff', border: '1px solid rgba(130,120,255,0.35)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 0.2s ease', fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(124,107,255,0.12)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Target size={19} /> AI Predictor
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0,
            marginTop: 72, borderRadius: 16, overflow: 'hidden',
            border: '1px solid var(--border)',
            animation: 'fadeUp 0.5s ease 0.4s both',
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '20px 16px', textAlign: 'center',
                background: 'rgba(22,22,42,0.7)',
                borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 12 }}>
            Everything You Need
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 17 }}>Three powerful modules, one integrated platform.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: 28, borderRadius: 18, position: 'relative', overflow: 'hidden',
                animation: `fadeUp 0.5s ease ${0.1 * i}s both`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 20px 50px ${f.color}22`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${f.color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ fontSize: 30, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 16 }}>{f.title}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {f.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text2)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(124,107,255,0.15) 0%, rgba(168,85,247,0.1) 100%)',
          border: '1px solid rgba(124,107,255,0.25)', borderRadius: 24,
          padding: '56px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,107,255,0.05), transparent, rgba(0,229,255,0.05))', pointerEvents: 'none' }} />
          <Rocket size={38} color="#7c6bff" style={{ marginBottom: 20 }} />
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 14 }}>
            Ready to predict your success?
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
            Input your startup details and get instant ML predictions, competitor insights, team structure, and strategic recommendations.
          </p>
          <button
            onClick={() => navigate('/predictor')}
            style={{
              padding: '14px 40px', borderRadius: 11, fontWeight: 700, fontSize: 16,
              background: 'linear-gradient(135deg, #7c6bff, #a855f7)',
              color: '#fff', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(124,107,255,0.4)',
              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🔮 Start Predicting Free
          </button>
        </div>
      </section>

      {/* ── Download Section ──────────────────────────────────── */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 10 }}>
              <Download size={22} style={{ display: 'inline', marginRight: 10, verticalAlign: 'middle', color: '#7c6bff' }} />
              Export Your Analysis
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.6 }}>
              {hasResults
                ? 'Your last prediction is ready — download a full PDF report or investor pitch deck.'
                : 'Run the AI Predictor first, then come back here to export your full report and pitch deck.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

            {/* ── PDF Report card ── */}
            <div
              className="glass"
              style={{
                padding: 28, borderRadius: 18, position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(124,107,255,0.2)',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,107,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,107,255,0.15)', border: '1px solid rgba(124,107,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={22} color="#7c6bff" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>PDF Report</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Full startup analysis document</div>
                </div>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, margin: 0, padding: 0 }}>
                {['ML prediction results', 'Strategic analysis & insights', 'Competitor intelligence', 'Team hierarchy & hiring guide', 'Risk assessment'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7c6bff', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>

              {reportError && (
                <div style={{ fontSize: 12, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '8px 12px' }}>
                  ⚠️ {reportError}
                </div>
              )}

              <button
                onClick={handleDownloadReport}
                disabled={reportLoading}
                style={{
                  marginTop: 'auto',
                  padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                  background: reportLoading
                    ? 'rgba(124,107,255,0.3)'
                    : hasResults
                      ? 'linear-gradient(135deg, #7c6bff, #a855f7)'
                      : 'rgba(124,107,255,0.12)',
                  color: hasResults ? '#fff' : '#a895ff',
                  border: hasResults ? 'none' : '1px solid rgba(124,107,255,0.3)',
                  cursor: reportLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s ease',
                  fontFamily: 'DM Sans, sans-serif',
                  boxShadow: hasResults && !reportLoading ? '0 6px 24px rgba(124,107,255,0.35)' : 'none',
                }}
                onMouseEnter={e => { if (!reportLoading) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {reportLoading ? (
                  <>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Generating…
                  </>
                ) : hasResults ? (
                  <><Download size={15} /> Download Report</>
                ) : (
                  <><Target size={15} /> Run Predictor First</>
                )}
              </button>
            </div>

            {/* ── Pitch Deck card ── */}
            <div
              className="glass"
              style={{
                padding: 28, borderRadius: 18, position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(168,85,247,0.2)',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={22} color="#a855f7" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>Pitch Deck</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Investor-ready .pptx presentation</div>
                </div>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, margin: 0, padding: 0 }}>
                {['Problem & solution slides', 'Market opportunity data', 'Competitor landscape', 'Team structure overview', 'Funding ask & projections'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>

              {pitchError && (
                <div style={{ fontSize: 12, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '8px 12px' }}>
                  ⚠️ {pitchError}
                </div>
              )}

              <button
                onClick={handleDownloadPitch}
                disabled={pitchLoading}
                style={{
                  marginTop: 'auto',
                  padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                  background: pitchLoading
                    ? 'rgba(168,85,247,0.3)'
                    : hasResults
                      ? 'linear-gradient(135deg, #a855f7, #7c6bff)'
                      : 'rgba(168,85,247,0.12)',
                  color: hasResults ? '#fff' : '#c084fc',
                  border: hasResults ? 'none' : '1px solid rgba(168,85,247,0.3)',
                  cursor: pitchLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s ease',
                  fontFamily: 'DM Sans, sans-serif',
                  boxShadow: hasResults && !pitchLoading ? '0 6px 24px rgba(168,85,247,0.35)' : 'none',
                }}
                onMouseEnter={e => { if (!pitchLoading) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {pitchLoading ? (
                  <>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Generating…
                  </>
                ) : hasResults ? (
                  <><Download size={15} /> Download Pitch Deck</>
                ) : (
                  <><Target size={15} /> Run Predictor First</>
                )}
              </button>
            </div>
          </div>

          {/* Helper note when no results yet */}
          {!hasResults && (
            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
              💡 After running the AI Predictor, your results are saved automatically and the download buttons will activate.
            </p>
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
        <strong style={{ color: 'var(--text2)' }}>🚀 BizGenius</strong> — Complete Startup Intelligence Platform &nbsp;·&nbsp; Analytics: Synthetic Data &nbsp;·&nbsp; Predictor: Real Data + Team Hierarchy + Live News
      </footer>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}