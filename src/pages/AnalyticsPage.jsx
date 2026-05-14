import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis,
  LineChart, Line, AreaChart, Area,
} from 'recharts'
import { ArrowLeft, Filter, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { MetricCard, TabBar, Card, SectionTitle, Divider, FullSpinner } from '../components/UI.jsx'
import { getAnalyticsData } from '../services/api.js'

const COLORS = ['#7c6bff', '#a855f7', '#00e5ff', '#34d399', '#fb7185', '#fbbf24', '#f87171', '#60a5fa']

// ─── Mock/fallback data if backend not connected ─────────────
function generateMockData(n = 200) {
  const cities = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai']
  const industries = ['EdTech', 'FinTech', 'HealthTech', 'SaaS', 'E-commerce', 'AI/ML']
  const stages = ['Seed', 'Series A', 'Series B', 'Series C', 'Pre-IPO']
  const success = ['High', 'Medium', 'Low']
  return Array.from({ length: n }, (_, i) => ({
    startup_id: i + 1,
    city: cities[Math.floor(Math.random() * cities.length)],
    primary_industry: industries[Math.floor(Math.random() * industries.length)],
    startup_stage: stages[Math.floor(Math.random() * stages.length)],
    total_funding_usd: Math.random() * 5000000 + 50000,
    success_score: Math.random() * 100,
    success_label: success[Math.floor(Math.random() * success.length)],
    employees_size_numeric: Math.floor(Math.random() * 500) + 1,
    is_active: Math.random() > 0.2,
    investor_count: Math.floor(Math.random() * 20) + 1,
    growth_rate_percent: (Math.random() - 0.3) * 200,
    company_age_years: Math.random() * 10 + 0.5,
    funding_rounds: Math.floor(Math.random() * 8) + 1,
  }))
}

const TABS = [
  { id: 'dashboard', label: '📊 Real-Time Dashboard', icon: null },
  { id: 'simulation', label: '🌍 Ecosystem Simulation', icon: null },
  { id: 'deepdive', label: '🔍 Deep Dive Analytics', icon: null },
]

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Filters
  const [selCities, setSelCities] = useState([])
  const [selIndustries, setSelIndustries] = useState([])
  const [selStages, setSelStages] = useState([])
  const [selSuccess, setSelSuccess] = useState(['High', 'Medium', 'Low'])
  const [fundingRange, setFundingRange] = useState([0, 5000000])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    getAnalyticsData()
      .then(res => setData(res.data || []))
      .catch(() => setData(generateMockData(250)))
      .finally(() => setLoading(false))
  }, [])

  const allCities = useMemo(() => [...new Set(data.map(d => d.city))].sort(), [data])
  const allIndustries = useMemo(() => [...new Set(data.map(d => d.primary_industry))].sort(), [data])
  const allStages = useMemo(() => [...new Set(data.map(d => d.startup_stage))].sort(), [data])

  useEffect(() => {
    if (data.length && !selCities.length) {
      setSelCities(allCities.slice(0, 5))
      setSelIndustries(allIndustries.slice(0, 5))
      setSelStages(allStages)
      const mx = Math.max(...data.map(d => d.total_funding_usd))
      setFundingRange([0, mx])
    }
  }, [data, allCities, allIndustries, allStages])

  const filtered = useMemo(() => data.filter(d =>
    (selCities.length === 0 || selCities.includes(d.city)) &&
    (selIndustries.length === 0 || selIndustries.includes(d.primary_industry)) &&
    (selStages.length === 0 || selStages.includes(d.startup_stage)) &&
    selSuccess.includes(d.success_label) &&
    d.total_funding_usd >= fundingRange[0] && d.total_funding_usd <= fundingRange[1]
  ), [data, selCities, selIndustries, selStages, selSuccess, fundingRange])

  // Aggregations
  const stageData = useMemo(() => {
    const map = {}
    filtered.forEach(d => {
      if (!map[d.startup_stage]) map[d.startup_stage] = { stage: d.startup_stage, funding: 0, count: 0 }
      map[d.startup_stage].funding += d.total_funding_usd
      map[d.startup_stage].count++
    })
    return Object.values(map).sort((a, b) => b.funding - a.funding)
  }, [filtered])

  const cityData = useMemo(() => {
    const map = {}
    filtered.forEach(d => {
      if (!map[d.city]) map[d.city] = { city: d.city, count: 0, funding: 0 }
      map[d.city].count++; map[d.city].funding += d.total_funding_usd
    })
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 8)
  }, [filtered])

  const industryData = useMemo(() => {
    const map = {}
    filtered.forEach(d => {
      if (!map[d.primary_industry]) map[d.primary_industry] = { name: d.primary_industry, value: 0 }
      map[d.primary_industry].value++
    })
    return Object.values(map)
  }, [filtered])

  const successData = useMemo(() => {
    const map = { High: 0, Medium: 0, Low: 0 }
    filtered.forEach(d => { if (map[d.success_label] !== undefined) map[d.success_label]++ })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const heatmapData = useMemo(() => {
    const cities = [...new Set(filtered.map(d => d.city))]
    const industries = [...new Set(filtered.map(d => d.primary_industry))]
    const result = []
    cities.forEach(city => {
      industries.forEach(ind => {
        const items = filtered.filter(d => d.city === city && d.primary_industry === ind)
        if (items.length) {
          const avg = items.reduce((s, d) => s + d.success_score, 0) / items.length
          result.push({ city, industry: ind, score: avg, count: items.length })
        }
      })
    })
    return result
  }, [filtered])

  const totalFunding = filtered.reduce((s, d) => s + d.total_funding_usd, 0)
  const avgSuccess = filtered.length ? filtered.reduce((s, d) => s + d.success_score, 0) / filtered.length : 0
  const activeRate = filtered.length ? (filtered.filter(d => d.is_active).length / filtered.length) * 100 : 0
  const totalEmployees = filtered.reduce((s, d) => s + (d.employees_size_numeric || 0), 0)

  const MultiSelect = ({ label, options, value, onChange }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ marginBottom: 8, display: 'block' }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(opt => {
          const sel = value.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => onChange(sel ? value.filter(v => v !== opt) : [...value, opt])}
              style={{
                padding: '4px 11px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                border: `1px solid ${sel ? 'rgba(124,107,255,0.5)' : 'var(--border)'}`,
                background: sel ? 'rgba(124,107,255,0.18)' : 'transparent',
                color: sel ? '#a895ff' : 'var(--text3)', cursor: 'pointer',
                transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', paddingTop: 60 }}>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <FullSpinner label="Loading ecosystem data..." />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', paddingTop: 60 }}>
      <Navbar />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, animation: 'fadeUp 0.4s ease both' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 14px', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
              📊 Startup Ecosystem Analytics
            </h1>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 2 }}>Synthetic dataset · {filtered.length.toLocaleString()} startups after filters</p>
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            style={{
              marginLeft: 'auto', background: showFilters ? 'rgba(124,107,255,0.18)' : 'var(--surface)',
              border: `1px solid ${showFilters ? 'rgba(124,107,255,0.4)' : 'var(--border)'}`,
              borderRadius: 9, padding: '9px 18px', color: showFilters ? '#a895ff' : 'var(--text2)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <Filter size={14} /> Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="glass" style={{ padding: 24, marginBottom: 24, borderRadius: 16, animation: 'fadeUp 0.3s ease both' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
              <MultiSelect label="🌆 Cities" options={allCities} value={selCities} onChange={setSelCities} />
              <MultiSelect label="🏭 Industries" options={allIndustries} value={selIndustries} onChange={setSelIndustries} />
              <MultiSelect label="🚀 Stages" options={allStages} value={selStages} onChange={setSelStages} />
              <MultiSelect label="⭐ Success Level" options={['High', 'Medium', 'Low']} value={selSuccess} onChange={setSelSuccess} />
            </div>
          </div>
        )}

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
          <MetricCard label="Total Startups" value={filtered.length.toLocaleString()} icon={<Activity size={18} color="#7c6bff" />} color="#7c6bff" delay={0} />
          <MetricCard label="Total Funding" value={`$${(totalFunding / 1e9).toFixed(2)}B`} icon={<DollarSign size={18} color="#a855f7" />} color="#a855f7" delay={0.05} />
          <MetricCard label="Avg Success Score" value={`${avgSuccess.toFixed(1)}/100`} icon={<TrendingUp size={18} color="#00e5ff" />} color="#00e5ff" delay={0.1} />
          <MetricCard label="Total Employees" value={totalEmployees.toLocaleString()} icon={<Users size={18} color="#34d399" />} color="#34d399" delay={0.15} />
          <MetricCard label="Active Rate" value={`${activeRate.toFixed(1)}%`} icon={<span>✅</span>} color="#fbbf24" delay={0.2} />
        </div>

        {/* Tab Bar */}
        <div style={{ marginBottom: 28 }}>
          <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        {/* ── Tab: Dashboard ── */}
        {activeTab === 'dashboard' && (
          <div style={{ animation: 'fadeUp 0.4s ease both' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="glass" style={{ padding: 22, borderRadius: 16 }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>💵 Funding by Stage</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(130,120,255,0.08)" />
                    <XAxis dataKey="stage" />
                    <YAxis tickFormatter={v => `$${(v/1e6).toFixed(0)}M`} />
                    <Tooltip formatter={v => [`$${(v/1e6).toFixed(2)}M`, 'Funding']} contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }} />
                    <Bar dataKey="funding" radius={[6,6,0,0]}>
                      {stageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass" style={{ padding: 22, borderRadius: 16 }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🌆 Geographic Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(130,120,255,0.08)" />
                    <XAxis type="number" />
                    <YAxis dataKey="city" type="category" width={80} />
                    <Tooltip contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }} />
                    <Bar dataKey="count" fill="#7c6bff" radius={[0,6,6,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="glass" style={{ padding: 22, borderRadius: 16 }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🏭 Industry Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={industryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                      {industryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="glass" style={{ padding: 22, borderRadius: 16 }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>⭐ Success Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={successData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4}>
                      {successData.map((entry, i) => (
                        <Cell key={i} fill={entry.name === 'High' ? '#34d399' : entry.name === 'Medium' ? '#fbbf24' : '#f87171'} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Simulation ── */}
        {activeTab === 'simulation' && (
          <div style={{ animation: 'fadeUp 0.4s ease both' }}>
            <div className="glass" style={{ padding: 22, borderRadius: 16, marginBottom: 20, overflowX: 'auto' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🌍 City Metrics Table</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['City', 'Startups', 'Total Funding', 'Avg Funding', 'Avg Success', 'Employees', 'Investors', 'Avg Growth'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text3)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cityData.map((row, i) => {
                    const cityItems = filtered.filter(d => d.city === row.city)
                    const avgS = cityItems.reduce((s, d) => s + d.success_score, 0) / (cityItems.length || 1)
                    const avgF = cityItems.reduce((s, d) => s + d.total_funding_usd, 0) / (cityItems.length || 1)
                    const emp = cityItems.reduce((s, d) => s + (d.employees_size_numeric || 0), 0)
                    const inv = cityItems.reduce((s, d) => s + (d.investor_count || 0), 0)
                    const growth = cityItems.reduce((s, d) => s + (d.growth_rate_percent || 0), 0) / (cityItems.length || 1)
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(130,120,255,0.05)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,107,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#fff' }}>{row.city}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{row.count}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>${(row.funding / 1e6).toFixed(2)}M</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>${(avgF / 1e6).toFixed(2)}M</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ color: avgS > 66 ? '#34d399' : avgS > 33 ? '#fbbf24' : '#f87171', fontWeight: 700 }}>{avgS.toFixed(1)}</span>
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{emp.toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{inv}</td>
                        <td style={{ padding: '10px 12px', color: growth >= 0 ? '#34d399' : '#f87171', fontWeight: 600 }}>{growth.toFixed(1)}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Heatmap (simplified as scatter) */}
            <div className="glass" style={{ padding: 22, borderRadius: 16 }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🔥 City-Industry Success Heatmap</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(130,120,255,0.08)" />
                  <XAxis dataKey="industry" type="category" name="Industry" />
                  <YAxis dataKey="city" type="category" name="City" width={90} />
                  <ZAxis dataKey="score" range={[40, 400]} name="Success Score" />
                  <Tooltip
                    content={({ payload }) => payload?.length ? (
                      <div style={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, padding: '10px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{payload[0]?.payload?.city} · {payload[0]?.payload?.industry}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)' }}>Avg Score: {payload[0]?.payload?.score?.toFixed(1)}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)' }}>Count: {payload[0]?.payload?.count}</div>
                      </div>
                    ) : null}
                  />
                  <Scatter data={heatmapData} fill="#7c6bff" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Tab: Deep Dive ── */}
        {activeTab === 'deepdive' && (
          <div style={{ animation: 'fadeUp 0.4s ease both' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="glass" style={{ padding: 22, borderRadius: 16 }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>📈 Funding vs Success Score</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(130,120,255,0.08)" />
                    <XAxis dataKey="total_funding_usd" name="Funding" tickFormatter={v => `$${(v/1e6).toFixed(0)}M`} />
                    <YAxis dataKey="success_score" name="Success" domain={[0, 100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }} />
                    <Scatter data={filtered.slice(0, 300)} fill="#7c6bff" fillOpacity={0.5} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="glass" style={{ padding: 22, borderRadius: 16 }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>👥 Company Age vs Employees</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(130,120,255,0.08)" />
                    <XAxis dataKey="company_age_years" name="Age (yrs)" />
                    <YAxis dataKey="employees_size_numeric" name="Employees" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }} />
                    <Scatter data={filtered.slice(0, 300)} fill="#a855f7" fillOpacity={0.5} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass" style={{ padding: 22, borderRadius: 16 }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>📊 Funding Rounds Distribution by Industry</h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={(() => {
                  const ind = [...new Set(filtered.map(d => d.primary_industry))]
                  return ind.map(i => {
                    const items = filtered.filter(d => d.primary_industry === i)
                    return {
                      industry: i,
                      avgRounds: items.reduce((s, d) => s + d.funding_rounds, 0) / items.length,
                      avgFunding: items.reduce((s, d) => s + d.total_funding_usd, 0) / items.length / 1e6,
                    }
                  })
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(130,120,255,0.08)" />
                  <XAxis dataKey="industry" />
                  <YAxis />
                  <Tooltip contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }} />
                  <Area type="monotone" dataKey="avgFunding" stroke="#7c6bff" fill="rgba(124,107,255,0.15)" name="Avg Funding ($M)" />
                  <Area type="monotone" dataKey="avgRounds" stroke="#00e5ff" fill="rgba(0,229,255,0.1)" name="Avg Rounds" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}