// import React, { useState } from 'react'
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
// import { ChevronDown, ChevronUp } from 'lucide-react'

// const COLORS = ['#7c6bff', '#f093fb', '#4facfe', '#43e97b', '#fa709a']

// export default function TeamHierarchy({ data, totalEmployees }) {
//   const [expanded, setExpanded] = useState(null)
//   if (!data) return null

//   const { ceo_title, ceo_expertise = [], departments = [], key_hiring_priorities = [], culture_values = [] } = data

//   const donutData = departments.map(d => ({ name: d.name, value: d.headcount }))

//   return (
//     <div>
//       {/* Donut Chart */}
//       <div className="glass" style={{ padding: 24, borderRadius: 16, marginBottom: 20 }}>
//         <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
//           Team Distribution — {totalEmployees} Employees
//         </h3>
//         <p style={{ color: 'var(--text3)', fontSize: 12, marginBottom: 16 }}>AI-generated org structure based on your startup profile</p>
//         <ResponsiveContainer width="100%" height={320}>
//           <PieChart>
//             <Pie
//               data={donutData} dataKey="value" nameKey="name"
//               cx="50%" cy="50%" innerRadius={75} outerRadius={120}
//               paddingAngle={3}
//               label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
//               labelLine={true}
//             >
//               {donutData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//             </Pie>
//             <Legend />
//             <Tooltip
//               contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }}
//               formatter={(v, n) => [v + ' people', n]}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* CEO Box */}
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
//         <div style={{
//           background: 'linear-gradient(135deg, #7c6bff, #a855f7)',
//           borderRadius: 14, padding: '16px 40px', textAlign: 'center',
//           boxShadow: '0 4px 24px rgba(124,107,255,0.4)', minWidth: 260,
//         }}>
//           <div style={{ fontSize: 10, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.8)' }}>Founding / Executive</div>
//           <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '4px 0', fontFamily: 'Syne, sans-serif' }}>👑 {ceo_title}</div>
//           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 8 }}>
//             {ceo_expertise.map((e, i) => (
//               <span key={i} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 5, padding: '2px 8px', fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>{e}</span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Connector line */}
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
//         <div style={{ width: 2, height: 24, background: 'linear-gradient(#7c6bff, var(--border))' }} />
//       </div>
//       <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #7c6bff, #a855f7, transparent)', margin: '0 60px 16px' }} />

//       {/* Department Cards */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16, marginBottom: 20 }}>
//         {departments.map((dept, i) => {
//           const color = COLORS[i % COLORS.length]
//           const isOpen = expanded === i
//           return (
//             <div key={i} className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
//               {/* Header */}
//               <div style={{ background: color, padding: '14px 16px' }}>
//                 <div style={{ fontSize: 10, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.85)' }}>{dept.head_title}</div>
//                 <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '2px 0', fontFamily: 'Syne, sans-serif' }}>{dept.name}</div>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
//                   {(dept.head_expertise || []).map((e, j) => (
//                     <span key={j} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 4, padding: '2px 7px', fontSize: 10, color: 'rgba(255,255,255,0.9)' }}>{e}</span>
//                   ))}
//                 </div>
//               </div>

//               {/* Team size row */}
//               <div style={{ background: 'var(--surface2)', padding: '8px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <span style={{ fontSize: 12, color: 'var(--text2)' }}>Team Size</span>
//                 <span style={{ fontWeight: 800, fontSize: 20, color, fontFamily: 'Syne, sans-serif' }}>{dept.headcount}</span>
//               </div>

//               {/* Roles (collapsible) */}
//               <div style={{ padding: '12px 16px' }}>
//                 {(dept.roles || []).slice(0, isOpen ? undefined : 3).map((role, j) => (
//                   <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, padding: '8px 10px', background: 'var(--surface2)', borderRadius: 8, borderLeft: `3px solid ${color}` }}>
//                     <div style={{ width: 26, height: 26, background: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
//                       {role.count}
//                     </div>
//                     <div>
//                       <div style={{ fontWeight: 600, fontSize: 12, color: '#fff' }}>{role.title}</div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
//                         {(role.expertise || []).map((e, k) => (
//                           <span key={k} style={{ background: 'rgba(130,120,255,0.12)', borderRadius: 4, padding: '1px 7px', fontSize: 10, color: 'var(--text2)' }}>{e}</span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(dept.roles || []).length > 3 && (
//                   <button
//                     onClick={() => setExpanded(isOpen ? null : i)}
//                     style={{
//                       width: '100%', marginTop: 4, padding: '6px', background: 'transparent',
//                       border: '1px dashed var(--border)', borderRadius: 7, color: 'var(--text2)',
//                       fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
//                       fontFamily: 'DM Sans, sans-serif',
//                     }}
//                   >
//                     {isOpen ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> +{dept.roles.length - 3} more roles</>}
//                   </button>
//                 )}
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* Hiring Priorities */}
//       <div className="glass" style={{ padding: '18px 22px', borderRadius: 14, borderLeft: '3px solid #7c6bff', marginBottom: 16 }}>
//         <div style={{ fontWeight: 700, fontSize: 15, color: '#7c6bff', marginBottom: 12 }}>🎯 Key Hiring Priorities</div>
//         <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
//           {key_hiring_priorities.map((p, i) => (
//             <li key={i} style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{p}</li>
//           ))}
//         </ol>
//       </div>

//       {/* Culture Values */}
//       <div className="glass" style={{ padding: '18px 22px', borderRadius: 14, borderLeft: '3px solid #34d399' }}>
//         <div style={{ fontWeight: 700, fontSize: 15, color: '#34d399', marginBottom: 12 }}>💫 Culture Values</div>
//         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//           {culture_values.map((v, i) => (
//             <span key={i} style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>
//               ★ {v}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Dept Summary Table */}
//       <div className="glass" style={{ marginTop: 16, borderRadius: 14, overflow: 'hidden' }}>
//         <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
//           <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', fontFamily: 'Syne, sans-serif' }}>📋 Department Summary</div>
//         </div>
//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//             <thead>
//               <tr style={{ borderBottom: '1px solid var(--border)' }}>
//                 {['Department', 'Head', 'Headcount', '% of Team', 'Head Expertise'].map(h => (
//                   <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text3)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {departments.map((d, i) => (
//                 <tr key={i}
//                   style={{ borderBottom: '1px solid rgba(130,120,255,0.05)' }}
//                   onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,107,255,0.04)'}
//                   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//                 >
//                   <td style={{ padding: '10px 16px', fontWeight: 700, color: COLORS[i % COLORS.length] }}>{d.name}</td>
//                   <td style={{ padding: '10px 16px', color: 'var(--text2)' }}>{d.head_title}</td>
//                   <td style={{ padding: '10px 16px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif' }}>{d.headcount}</td>
//                   <td style={{ padding: '10px 16px', color: 'var(--text2)' }}>{d.percentage}%</td>
//                   <td style={{ padding: '10px 16px', color: 'var(--text2)', fontSize: 12 }}>{(d.head_expertise || []).join(', ')}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ChevronDown, ChevronUp, Briefcase, ListOrdered, Users, BookOpen } from 'lucide-react'

const COLORS = ['#7c6bff', '#f093fb', '#4facfe', '#43e97b', '#fa709a']

const PRIORITY_COLOR = { High: '#f87171', Medium: '#fbbf24', Low: '#34d399' }

// ─── Hiring Guide sub-component ──────────────────────────────
function HiringGuide({ data }) {
  const [openProfile, setOpenProfile] = useState(null)
  if (!data) return (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>
      Hiring guide not generated yet.
    </div>
  )

  const { hiring_profiles = [], hiring_sequence = [], culture_fit_signals = [], onboarding_tips = '' } = data

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Hiring Sequence ─────────────────────────────────── */}
      <div className="glass" style={{ padding: '18px 22px', borderRadius: 14, borderLeft: '3px solid #7c6bff' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#7c6bff', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ListOrdered size={16} /> Recommended Hiring Sequence
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hiring_sequence.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              {/* Step bubble */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #7c6bff, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff',
              }}>{s.order}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{s.role}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{s.rationale}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hiring Profiles ─────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {hiring_profiles.map((profile, i) => {
          const isOpen = openProfile === i
          const pColor = PRIORITY_COLOR[profile.priority] || '#a895ff'

          return (
            <div key={i} className="glass" style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${pColor}28` }}>

              {/* Card header — always visible */}
              <div
                onClick={() => setOpenProfile(isOpen ? null : i)}
                style={{
                  padding: '16px 20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  background: `linear-gradient(90deg, ${pColor}12, transparent)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                  {/* Priority badge */}
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: pColor, boxShadow: `0 0 8px ${pColor}88`,
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
                      {profile.role}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 5 }}>
                      <span style={{ fontSize: 11, color: pColor, fontWeight: 700, background: `${pColor}18`, borderRadius: 5, padding: '2px 8px' }}>
                        {profile.priority} Priority
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text3)', background: 'var(--surface2)', borderRadius: 5, padding: '2px 8px' }}>
                        {profile.department}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text3)', background: 'var(--surface2)', borderRadius: 5, padding: '2px 8px' }}>
                        {profile.seniority} · {profile.experience_years} yrs
                      </span>
                      <span style={{ fontSize: 11, color: '#34d399', background: 'rgba(52,211,153,0.1)', borderRadius: 5, padding: '2px 8px', fontWeight: 600 }}>
                        {profile.salary_range}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ flexShrink: 0, color: 'var(--text3)' }}>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Why Critical */}
                  <div style={{ padding: '10px 14px', background: `${pColor}10`, borderRadius: 9, borderLeft: `3px solid ${pColor}`, marginTop: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: pColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Why Critical</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{profile.why_critical}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>

                    {/* Must-Have Skills */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>✅ Must-Have Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {profile.must_have_skills.map((s, j) => (
                          <span key={j} style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: 'rgba(124,107,255,0.18)', border: '1px solid rgba(124,107,255,0.3)', borderRadius: 6, padding: '3px 9px' }}>{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Nice-to-Have Skills */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>⭐ Nice to Have</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {profile.nice_to_have_skills.map((s, j) => (
                          <span key={j} style={{ fontSize: 11, color: 'var(--text2)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 9px' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>🎓 Qualifications</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {profile.qualifications.map((q, j) => (
                        <div key={j} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <span style={{ color: '#7c6bff', marginTop: 1, flexShrink: 0 }}>›</span> {q}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>📋 Key Responsibilities</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {profile.key_responsibilities.map((r, j) => (
                        <div key={j} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', background: 'var(--surface2)', borderRadius: 7 }}>
                          <span style={{ color: pColor, flexShrink: 0, marginTop: 1 }}>{j + 1}.</span> {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Signals */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>🔍 Interview Signals</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {profile.interview_signals.map((s, j) => (
                        <span key={j} style={{ fontSize: 12, color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 7, padding: '4px 12px', fontWeight: 600 }}>
                          🎯 {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Culture Fit Signals ─────────────────────────────── */}
      <div className="glass" style={{ padding: '18px 22px', borderRadius: 14, borderLeft: '3px solid #34d399' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#34d399', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={16} /> Culture Fit Signals
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {culture_fit_signals.map((v, i) => (
            <span key={i} style={{
              background: 'rgba(52,211,153,0.08)', color: '#34d399',
              border: '1px solid rgba(52,211,153,0.25)', borderRadius: 8,
              padding: '6px 14px', fontSize: 13, fontWeight: 600,
            }}>★ {v}</span>
          ))}
        </div>
      </div>

      {/* ── Onboarding Tips ─────────────────────────────────── */}
      {onboarding_tips && (
        <div className="glass" style={{ padding: '18px 22px', borderRadius: 14, borderLeft: '3px solid #fbbf24' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fbbf24', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={16} /> Onboarding Tips
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>{onboarding_tips}</p>
        </div>
      )}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────
export default function TeamHierarchy({ data, hiringGuide, totalEmployees }) {
  const [tab, setTab] = useState('org')          // 'org' | 'hiring'
  const [expanded, setExpanded] = useState(null)
  if (!data) return null

  const { ceo_title, ceo_expertise = [], departments = [], key_hiring_priorities = [], culture_values = [] } = data
  const donutData = departments.map(d => ({ name: d.name, value: d.headcount }))

  const TAB_STYLE = (active) => ({
    padding: '8px 22px', borderRadius: 8, fontWeight: 700, fontSize: 13,
    cursor: 'pointer', border: 'none', fontFamily: 'DM Sans, sans-serif',
    background: active ? 'linear-gradient(135deg, #7c6bff, #a855f7)' : 'transparent',
    color: active ? '#fff' : 'var(--text3)',
    boxShadow: active ? '0 4px 16px rgba(124,107,255,0.3)' : 'none',
    transition: 'all 0.2s ease',
  })

  return (
    <div>
      {/* ── Tab switcher ──────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20,
        background: 'var(--surface2)', borderRadius: 11,
        padding: 4, width: 'fit-content',
        border: '1px solid var(--border)',
      }}>
        <button style={TAB_STYLE(tab === 'org')} onClick={() => setTab('org')}>
          🏢 Org Structure
        </button>
        <button style={TAB_STYLE(tab === 'hiring')} onClick={() => setTab('hiring')}>
          <Briefcase size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          Hiring Guide
          {hiringGuide && (
            <span style={{
              marginLeft: 7, background: '#7c6bff', color: '#fff',
              borderRadius: 99, padding: '1px 7px', fontSize: 10, fontWeight: 800,
            }}>
              {hiringGuide.hiring_profiles?.length || 0}
            </span>
          )}
        </button>
      </div>

      {/* ── ORG STRUCTURE TAB ────────────────────────────── */}
      {tab === 'org' && (
        <>
          {/* Donut Chart */}
          <div className="glass" style={{ padding: 24, borderRadius: 16, marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              Team Distribution — {totalEmployees} Employees
            </h3>
            <p style={{ color: 'var(--text3)', fontSize: 12, marginBottom: 16 }}>AI-generated org structure based on your startup profile</p>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={donutData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" innerRadius={75} outerRadius={120}
                  paddingAngle={3}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {donutData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }}
                  formatter={(v, n) => [v + ' people', n]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* CEO Box */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{
              background: 'linear-gradient(135deg, #7c6bff, #a855f7)',
              borderRadius: 14, padding: '16px 40px', textAlign: 'center',
              boxShadow: '0 4px 24px rgba(124,107,255,0.4)', minWidth: 260,
            }}>
              <div style={{ fontSize: 10, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.8)' }}>Founding / Executive</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '4px 0', fontFamily: 'Syne, sans-serif' }}>👑 {ceo_title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 8 }}>
                {ceo_expertise.map((e, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 5, padding: '2px 8px', fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>{e}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Connector line */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
            <div style={{ width: 2, height: 24, background: 'linear-gradient(#7c6bff, var(--border))' }} />
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #7c6bff, #a855f7, transparent)', margin: '0 60px 16px' }} />

          {/* Department Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16, marginBottom: 20 }}>
            {departments.map((dept, i) => {
              const color = COLORS[i % COLORS.length]
              const isOpen = expanded === i
              return (
                <div key={i} className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ background: color, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.85)' }}>{dept.head_title}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '2px 0', fontFamily: 'Syne, sans-serif' }}>{dept.name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                      {(dept.head_expertise || []).map((e, j) => (
                        <span key={j} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 4, padding: '2px 7px', fontSize: 10, color: 'rgba(255,255,255,0.9)' }}>{e}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface2)', padding: '8px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>Team Size</span>
                    <span style={{ fontWeight: 800, fontSize: 20, color, fontFamily: 'Syne, sans-serif' }}>{dept.headcount}</span>
                  </div>

                  <div style={{ padding: '12px 16px' }}>
                    {(dept.roles || []).slice(0, isOpen ? undefined : 3).map((role, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, padding: '8px 10px', background: 'var(--surface2)', borderRadius: 8, borderLeft: `3px solid ${color}` }}>
                        <div style={{ width: 26, height: 26, background: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                          {role.count}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12, color: '#fff' }}>{role.title}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                            {(role.expertise || []).map((e, k) => (
                              <span key={k} style={{ background: 'rgba(130,120,255,0.12)', borderRadius: 4, padding: '1px 7px', fontSize: 10, color: 'var(--text2)' }}>{e}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {(dept.roles || []).length > 3 && (
                      <button
                        onClick={() => setExpanded(isOpen ? null : i)}
                        style={{
                          width: '100%', marginTop: 4, padding: '6px', background: 'transparent',
                          border: '1px dashed var(--border)', borderRadius: 7, color: 'var(--text2)',
                          fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                      >
                        {isOpen ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> +{dept.roles.length - 3} more roles</>}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Hiring Priorities */}
          <div className="glass" style={{ padding: '18px 22px', borderRadius: 14, borderLeft: '3px solid #7c6bff', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#7c6bff', marginBottom: 12 }}>🎯 Key Hiring Priorities</div>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {key_hiring_priorities.map((p, i) => (
                <li key={i} style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{p}</li>
              ))}
            </ol>
          </div>

          {/* Culture Values */}
          <div className="glass" style={{ padding: '18px 22px', borderRadius: 14, borderLeft: '3px solid #34d399' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#34d399', marginBottom: 12 }}>💫 Culture Values</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {culture_values.map((v, i) => (
                <span key={i} style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>
                  ★ {v}
                </span>
              ))}
            </div>
          </div>

          {/* Dept Summary Table */}
          <div className="glass" style={{ marginTop: 16, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', fontFamily: 'Syne, sans-serif' }}>📋 Department Summary</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Department', 'Head', 'Headcount', '% of Team', 'Head Expertise'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text3)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d, i) => (
                    <tr key={i}
                      style={{ borderBottom: '1px solid rgba(130,120,255,0.05)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,107,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 16px', fontWeight: 700, color: COLORS[i % COLORS.length] }}>{d.name}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--text2)' }}>{d.head_title}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif' }}>{d.headcount}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--text2)' }}>{d.percentage}%</td>
                      <td style={{ padding: '10px 16px', color: 'var(--text2)', fontSize: 12 }}>{(d.head_expertise || []).join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── HIRING GUIDE TAB ─────────────────────────────── */}
      {tab === 'hiring' && <HiringGuide data={hiringGuide} />}
    </div>
  )
}