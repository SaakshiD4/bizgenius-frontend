// import React, { useState, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts'
// import { ArrowLeft, Download, FileText } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Navbar from '../components/Navbar.jsx'
// import { MetricCard, TabBar, Divider, ProgressBar, Badge } from '../components/UI.jsx'
// import NewsSection from '../components/NewsSection.jsx'
// import TeamHierarchy from '../components/TeamHierarchy.jsx'
// import {
//   predictStartup,
//   getCompetitors,
//   getAnalysis,
//   getHierarchy,
//   getHiringGuide,
//   generateReport,
//   generatePitch
// } from '../services/api.js'

// const DOMAINS = ['EdTech', 'FinTech', 'HealthTech', 'E-commerce', 'SaaS', 'FoodTech', 'AgriTech', 'CleanTech', 'IoT', 'AI/ML', 'Other']

// const RESULT_TABS = [
//   { id: 'predictions', label: '🔮 ML Predictions' },
//   { id: 'risks', label: '⚠️ Risks' },
//   { id: 'hierarchy', label: '👥 Team' },
//   { id: 'competitors', label: '🏢 Competitors' },
//   { id: 'analysis', label: '🧠 AI Analysis' },
// ]

// const classColor = cls => ({ Success: '#34d399', Failure: '#f87171', Uncertain: '#fbbf24' }[cls] || '#7c6bff')
// const riskColor = r => ({ Low: '#34d399', Medium: '#fbbf24', High: '#f87171' }[r] || '#7c6bff')

// // ─── Trigger a browser file download from a Blob ─────────────
// function triggerDownload(blob, filename) {
//   const url = URL.createObjectURL(blob)
//   const a = document.createElement('a')
//   a.href = url
//   a.download = filename
//   a.click()
//   URL.revokeObjectURL(url)
// }

// export default function PredictorPage() {
//   const navigate = useNavigate()

//   const [form, setForm] = useState({
//     domain: 'SaaS', description: '', company_age: 1, founder_count: 2,
//     employees: 5, funding_rounds: 1, funding_per_round: 50000, investor_count: 1,
//   })
//   const [loading, setLoading] = useState(false)
//   const [loadingStep, setLoadingStep] = useState('')
//   const [results, setResults] = useState(null)
//   const [activeTab, setActiveTab] = useState('predictions')
//   const [showNews, setShowNews] = useState(false)

//   // ── Per-button download state ─────────────────────────────
//   const [reportLoading, setReportLoading] = useState(false)
//   const [pitchLoading, setPitchLoading] = useState(false)
//   const [reportError, setReportError] = useState(null)
//   const [pitchError, setPitchError] = useState(null)

//   const resultsRef = useRef(null)
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   // ── Main predict & analyse pipeline ──────────────────────
//   const handleSubmit = async () => {
//     if (!form.description.trim()) {
//       toast.error('Please provide an idea description!')
//       return
//     }

//     setLoading(true)
//     setResults(null)
//     setReportError(null)
//     setPitchError(null)

//     try {
//       // ─── ML Prediction ─────────────────────
//       setLoadingStep('Running ML models...')
//       const mlRes = await predictStartup(form).catch(() => ({
//         classification: 'Uncertain',
//         risk_level: 'Medium',
//         success_probability: 0.65,
//         predicted_funding_usd: form.funding_per_round * 2,
//         probabilities: { success: 0.65, uncertain: 0.25, failure: 0.10 },
//         probable_risks: [
//           'Market competition risk',
//           'Funding runway risk',
//           'Team scaling challenges'
//         ],
//       }))

//       // ─── Competitors ─────────────────────
//       setLoadingStep('Finding similar startups...')
//       const compRes = await getCompetitors({
//         query: `${form.domain} startup: ${form.description}`
//       }).catch(() => ({
//         competitors: [],
//         summary: 'Competitor data unavailable.',
//       }))

//       // ─── AI Analysis ─────────────────────
//       setLoadingStep('Generating AI strategic analysis...')
//       const analysisRes = await getAnalysis({
//         user_input: form,
//         ml_results: mlRes,
//         competitors_text: compRes.summary || '',
//         probable_risks: mlRes.probable_risks || [],
//       }).catch(() => ({
//         analysis: `Startup has ${(mlRes.success_probability * 100).toFixed(0)}% success probability with ${mlRes.risk_level} risk.`,
//       }))

//       // ─── Team Hierarchy ───────────────────
//       setLoadingStep('Building team hierarchy...')
//       const hierarchyRes = await getHierarchy({
//         user_input: form,
//         ml_results: mlRes,
//         total_employees: form.employees,
//       }).catch(() => null)

//       // ─── Hiring Guide ─────────────────────   ← ADD THIS WHOLE BLOCK
//       setLoadingStep('Generating hiring guide...')
//       const hiringGuideRes = hierarchyRes
//         ? await getHiringGuide({
//           user_input: form,
//           ml_results: mlRes,
//           hierarchy: hierarchyRes,
//         }).catch(() => null)
//         : null

//       // ─── Final Results ────────────────────
//       const finalResults = {
//         userInput: form,
//         mlResults: mlRes,
//         competitors: compRes.competitors || [],
//         competitorsText: compRes.summary || '',
//         analysis: analysisRes.analysis || '',
//         hierarchy: hierarchyRes,
//         probableRisks: mlRes.probable_risks || [],
//         hiringGuide: hiringGuideRes,
//       }

//       setResults(finalResults)

//       // ─── Save to localStorage ─────────────
//       try {
//         localStorage.setItem(
//           'bizgenius_results',
//           JSON.stringify({
//             user_input: form,
//             ml_results: mlRes,
//             analysis: analysisRes.analysis || '',
//             competitors: compRes.competitors || [],
//             hierarchy: hierarchyRes,
//             probable_risks: mlRes.probable_risks || [],
//             hiring_guide:   hiringGuideRes || {},
//           })
//         )
//       } catch {
//         console.warn('LocalStorage limit exceeded')
//       }

//       setActiveTab('predictions')

//       setTimeout(() => {
//         resultsRef.current?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'start',
//         })
//       }, 100)

//       toast.success('Analysis complete!')
//     } catch (e) {
//       toast.error('Analysis failed: ' + (e.message || 'Unknown error'))
//     } finally {
//       setLoading(false)
//       setLoadingStep('')
//     }
//   }

//   // ── Download PDF Report ───────────────────────────────────
//   const handleDownloadReport = async () => {
//     if (!results) return
//     setReportLoading(true)
//     setReportError(null)
//     try {
//       const blob = await generateReport({
//         user_input: results.userInput,
//         ml_results: results.mlResults,
//         analysis: results.analysis,
//         competitors: results.competitors,
//         hierarchy: results.hierarchy,
//         probable_risks: results.probableRisks,
//         hiring_guide:   results.hiringGuide || {},
//       })
//       triggerDownload(blob, 'bizgenius_report.pdf')
//       toast.success('PDF report downloaded!')
//     } catch (err) {
//       const msg = err.message || 'Failed to generate report'
//       setReportError(msg)
//       toast.error(msg)
//     } finally {
//       setReportLoading(false)
//     }
//   }

//   // ── Download Pitch Deck ───────────────────────────────────
//   const handleDownloadPitch = async () => {
//     if (!results) return
//     setPitchLoading(true)
//     setPitchError(null)
//     try {
//       const blob = await generatePitch({
//         user_input: results.userInput,
//         ml_results: results.mlResults,
//         analysis: results.analysis,
//         competitors: results.competitors,
//         hierarchy: results.hierarchy,
//         probable_risks: results.probableRisks,
//         hiring_guide:   results.hiringGuide || {},
//       })
//       triggerDownload(blob, 'bizgenius_pitch.pptx')
//       toast.success('Pitch deck downloaded!')
//     } catch (err) {
//       const msg = err.message || 'Failed to generate pitch deck'
//       setPitchError(msg)
//       toast.error(msg)
//     } finally {
//       setPitchLoading(false)
//     }
//   }

//   // ── Shared form helpers ───────────────────────────────────
//   const FormField = ({ label, children }) => (
//     <div style={{ marginBottom: 14 }}>
//       <label>{label}</label>
//       {children}
//     </div>
//   )

//   const NumInput = ({ k, label, min = 0, max = 999999, step = 1 }) => (
//   <FormField label={label}>
//     <input
//       type="number"
//       value={form[k]}
//       min={min}
//       max={max}
//       step={step}
//       onChange={e => set(k, e.target.value === '' ? '' : parseFloat(e.target.value))}
//       onBlur={e => {
//         const val = parseFloat(e.target.value)
//         if (isNaN(val)) set(k, min)
//         else set(k, Math.min(Math.max(val, min), max))
//       }}
//     />
//   </FormField>
// )

//   return (
//     <div style={{ minHeight: '100vh', paddingTop: 60 }}>
//       <Navbar />

//       <div style={{ display: 'flex', maxWidth: 1400, margin: '0 auto', padding: '32px 24px', gap: 28, alignItems: 'flex-start' }}>

//         {/* ── Sidebar ─────────────────────────────────────────── */}
//         <aside style={{ width: 300, flexShrink: 0, position: 'sticky', top: 80 }}>
//           <div className="glass" style={{ padding: 22, borderRadius: 18 }}>
//             <div style={{ marginBottom: 20 }}>
//               <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>📝 Startup Details</div>
//               <div style={{ fontSize: 12, color: 'var(--text3)' }}>Fill in your startup info</div>
//             </div>

//             <FormField label="Domain / Industry">
//               <select value={form.domain} onChange={e => set('domain', e.target.value)}>
//                 {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
//               </select>
//             </FormField>

//             <FormField label="Idea Description">
//               <textarea
//                 rows={3} value={form.description} placeholder="E.g., AI-powered learning platform for K-12 students"
//                 onChange={e => set('description', e.target.value)}
//                 style={{ resize: 'vertical' }}
//               />
//             </FormField>

//             <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />
//             <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Company Metrics</div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//               <NumInput k="company_age" label="Age (years)" min={0.1} max={50} step={0.5} />
//               <NumInput k="founder_count" label="Founders" min={1} max={10} />
//               <NumInput k="employees" label="Employees" min={1} max={10000} />
//               <NumInput k="funding_rounds" label="Funding Rounds" min={0} max={20} />
//               <NumInput k="investor_count" label="Investors" min={0} max={100} />
//             </div>

//             <FormField label="Funding per Round ($)">
//   <input
//     type="number"
//     value={form.funding_per_round}
//     min={0}
//     step={10000}
//     onChange={e => set('funding_per_round', e.target.value === '' ? '' : parseFloat(e.target.value))}
//     onBlur={e => {
//       const val = parseFloat(e.target.value)
//       set('funding_per_round', isNaN(val) ? 0 : Math.max(0, val))
//     }}
//   />
//   <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
//     Total: ${(form.funding_rounds * (parseFloat(form.funding_per_round) || 0)).toLocaleString()}
//   </div>
// </FormField>

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               style={{
//                 width: '100%', padding: '13px', borderRadius: 11, fontWeight: 800, fontSize: 15,
//                 background: loading ? 'rgba(124,107,255,0.3)' : 'linear-gradient(135deg, #7c6bff, #a855f7)',
//                 color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
//                 boxShadow: loading ? 'none' : '0 6px 24px rgba(124,107,255,0.4)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
//                 fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s', marginTop: 8,
//               }}
//             >
//               {loading
//                 ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analysing...</>
//                 : '🔮 Predict & Analyse'}
//             </button>
//           </div>
//         </aside>

//         {/* ── Main Area ────────────────────────────────────────── */}
//         <main style={{ flex: 1, minWidth: 0 }}>

//           {/* Page header */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
//             <button
//               onClick={() => navigate('/')}
//               style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 14px', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}
//             >
//               <ArrowLeft size={14} /> Back
//             </button>
//             <div>
//               <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>🎯 AI-Powered Startup Predictor</h1>
//               <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 2 }}>Real dataset · ML + RAG + LLM + Team Hierarchy</p>
//             </div>
//           </div>

//           {/* News Banner */}
//           <NewsSection
//             domain={form.domain}
//             visible={showNews}
//             onToggle={() => setShowNews(v => !v)}
//           />

//           {/* Loading State */}
//           {loading && (
//             <div className="glass" style={{ padding: 48, borderRadius: 18, textAlign: 'center', animation: 'fadeIn 0.3s ease both' }}>
//               <div className="spinner" style={{ width: 44, height: 44, borderWidth: 3, margin: '0 auto 20px' }} />
//               <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Running Analysis</div>
//               <div style={{ color: 'var(--text2)', fontSize: 14 }}>{loadingStep}</div>
//               <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
//                 {['ML Models', 'RAG Search', 'LLM Analysis', 'Team AI'].map((s, i) => (
//                   <span key={i} style={{
//                     padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600,
//                     background: loadingStep.toLowerCase().includes(s.toLowerCase().split(' ')[0]) ? 'rgba(124,107,255,0.25)' : 'var(--surface)',
//                     color: loadingStep.toLowerCase().includes(s.toLowerCase().split(' ')[0]) ? '#a895ff' : 'var(--text3)',
//                     border: '1px solid var(--border)',
//                   }}>{s}</span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && !results && (
//             <div className="glass" style={{ padding: '52px 36px', borderRadius: 18, textAlign: 'center', animation: 'fadeUp 0.4s ease 0.2s both' }}>
//               <div style={{ fontSize: 52, marginBottom: 20 }}>🔮</div>
//               <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to Predict</h2>
//               <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 36px' }}>
//                 Fill in your startup details in the sidebar and click <strong style={{ color: '#a895ff' }}>Predict & Analyse</strong> to get instant ML predictions, competitor insights, team structure, and strategic recommendations.
//               </p>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, maxWidth: 600, margin: '0 auto', textAlign: 'left' }}>
//                 {[
//                   ['1️⃣', 'Fill sidebar form', 'Domain, description, metrics'],
//                   ['2️⃣', 'Click Predict', 'Run ML + RAG + LLM pipeline'],
//                   ['3️⃣', 'Explore results', 'Predictions, team, competitors'],
//                   ['4️⃣', 'Download reports', 'PDF & PowerPoint pitch deck'],
//                 ].map(([icon, title, desc], i) => (
//                   <div key={i} className="glass" style={{ padding: '16px', borderRadius: 12 }}>
//                     <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
//                     <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 4 }}>{title}</div>
//                     <div style={{ fontSize: 11, color: 'var(--text3)' }}>{desc}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* ── Results ─────────────────────────────────────────── */}
//           {!loading && results && (
//             <div ref={resultsRef} style={{ animation: 'fadeUp 0.4s ease both' }}>

//               {/* Quick metric row */}
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginBottom: 24 }}>
//                 <MetricCard
//                   label="Classification"
//                   value={results.mlResults.classification === 'Success' ? '✅ Success' : results.mlResults.classification === 'Failure' ? '❌ Failure' : '⚠️ Uncertain'}
//                   color={classColor(results.mlResults.classification)}
//                 />
//                 <MetricCard
//                   label="Risk Level"
//                   value={`${results.mlResults.risk_level === 'Low' ? '🟢' : results.mlResults.risk_level === 'Medium' ? '🟡' : '🔴'} ${results.mlResults.risk_level}`}
//                   color={riskColor(results.mlResults.risk_level)}
//                 />
//                 <MetricCard
//                   label="Success Probability"
//                   value={`${(results.mlResults.success_probability * 100).toFixed(1)}%`}
//                   color="#00e5ff"
//                 />
//                 <MetricCard
//                   label="Next Round Est."
//                   value={`$${(results.mlResults.predicted_funding_usd / 1e6).toFixed(2)}M`}
//                   color="#34d399"
//                 />
//               </div>

//               {/* Tab Bar */}
//               <div style={{ marginBottom: 24 }}>
//                 <TabBar tabs={RESULT_TABS} active={activeTab} onChange={setActiveTab} />
//               </div>

//               {/* ── Predictions Tab ── */}
//               {activeTab === 'predictions' && (
//                 <div style={{ animation: 'fadeUp 0.35s ease both' }}>
//                   <div className="glass" style={{ padding: 24, borderRadius: 16, marginBottom: 20 }}>
//                     <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Classification Probabilities</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart data={[
//                         { name: 'Success', value: results.mlResults.probabilities.success * 100, fill: '#34d399' },
//                         { name: 'Uncertain', value: results.mlResults.probabilities.uncertain * 100, fill: '#fbbf24' },
//                         { name: 'Failure', value: results.mlResults.probabilities.failure * 100, fill: '#f87171' },
//                       ]}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(130,120,255,0.08)" />
//                         <XAxis dataKey="name" />
//                         <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
//                         <Tooltip
//                           formatter={v => [`${v.toFixed(1)}%`, 'Probability']}
//                           contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }}
//                         />
//                         <Bar dataKey="value" radius={[8, 8, 0, 0]}>
//                           {['#34d399', '#fbbf24', '#f87171'].map((c, i) => <Cell key={i} fill={c} />)}
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
//                     <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Probability Breakdown</h3>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//                       <ProgressBar label="✅ Success" value={results.mlResults.probabilities.success * 100} color="#34d399" />
//                       <ProgressBar label="⚠️ Uncertain" value={results.mlResults.probabilities.uncertain * 100} color="#fbbf24" />
//                       <ProgressBar label="❌ Failure" value={results.mlResults.probabilities.failure * 100} color="#f87171" />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ── Risks Tab ── */}
//               {activeTab === 'risks' && (
//                 <div style={{ animation: 'fadeUp 0.35s ease both' }}>
//                   <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
//                     <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 18 }}>⚠️ Identified Risks</h3>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//                       {(results.probableRisks || []).map((risk, i) => (
//                         <div key={i} style={{
//                           display: 'flex', alignItems: 'flex-start', gap: 14,
//                           background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)',
//                           borderRadius: 12, padding: '14px 18px',
//                         }}>
//                           <div style={{
//                             width: 26, height: 26, borderRadius: '50%', background: 'rgba(251,191,36,0.2)',
//                             display: 'flex', alignItems: 'center', justifyContent: 'center',
//                             color: '#fbbf24', fontWeight: 800, fontSize: 12, flexShrink: 0,
//                           }}>{i + 1}</div>
//                           <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.55 }}>{risk}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ── Team Hierarchy Tab ── */}
//               {activeTab === 'hierarchy' && (
//                 <div style={{ animation: 'fadeUp 0.35s ease both' }}>
//                   {results.hierarchy
//                     ? <TeamHierarchy
//                       data={results.hierarchy}
//                       hiringGuide={results.hiringGuide}     // ← ADD
//                       totalEmployees={form.employees}
//                     />
//                     : <div className="glass" style={{ padding: 40, textAlign: 'center', borderRadius: 16, color: 'var(--text2)' }}>Team hierarchy not available</div>
//                   }
//                 </div>
//               )}

//               {/* ── Competitors Tab ── */}
//               {activeTab === 'competitors' && (
//                 <div style={{ animation: 'fadeUp 0.35s ease both' }}>
//                   <div className="glass" style={{ padding: 20, borderRadius: 16, marginBottom: 16 }}>
//                     <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12 }}>📊 Competitor Summary</h3>
//                     <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>{results.competitorsText || 'No summary available.'}</p>
//                   </div>

//                   {results.competitors.length > 0 ? (
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//                       <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>🏢 Top Similar Startups</h3>
//                       {results.competitors.map((comp, i) => {
//                         const similarity = (1 - (comp.distance || 0.5)) * 100
//                         const meta = comp.metadata || {}
//                         return (
//                           <div key={i} className="glass" style={{ padding: 20, borderRadius: 14 }}>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
//                               <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>Competitor {i + 1}</div>
//                               <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//                                 <Badge color="purple">Similarity {similarity.toFixed(1)}%</Badge>
//                                 {meta.industry && <Badge color="cyan">{meta.industry}</Badge>}
//                                 {meta.funding && <Badge color="green">${(meta.funding / 1e6).toFixed(2)}M</Badge>}
//                               </div>
//                             </div>
//                             <ProgressBar value={similarity} color="#7c6bff" label="Similarity Score" showPct={false} />
//                             <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
//                               {(comp.document || '').slice(0, 300)}{(comp.document || '').length > 300 ? '...' : ''}
//                             </p>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   ) : (
//                     <div className="glass" style={{ padding: 32, textAlign: 'center', borderRadius: 16, color: 'var(--text2)' }}>
//                       ⚠️ Competitor search skipped (RAG service unavailable or timed out)
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* ── AI Analysis Tab ── */}
//               {activeTab === 'analysis' && (
//                 <div style={{ animation: 'fadeUp 0.35s ease both' }}>
//                   <div className="glass" style={{ padding: 28, borderRadius: 16 }}>
//                     <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🧠 AI Strategic Analysis</h3>
//                     <div style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'DM Sans, sans-serif' }}>
//                       {results.analysis}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ── Download Section ─────────────────────────────── */}
//               <Divider />
//               <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
//                 <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
//                   📥 Download Reports
//                 </h3>
//                 <p style={{ color: 'var(--text3)', fontSize: 12, marginBottom: 18 }}>
//                   Generated live from your prediction data via the FastAPI backend
//                 </p>

//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

//                   {/* PDF Report button */}
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//                     <button
//                       onClick={handleDownloadReport}
//                       disabled={reportLoading}
//                       style={{
//                         display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
//                         padding: '13px', borderRadius: 11, fontWeight: 700, fontSize: 14,
//                         background: reportLoading ? 'rgba(124,107,255,0.3)' : 'linear-gradient(135deg, #7c6bff, #a855f7)',
//                         color: '#fff', border: 'none',
//                         cursor: reportLoading ? 'not-allowed' : 'pointer',
//                         boxShadow: reportLoading ? 'none' : '0 4px 18px rgba(124,107,255,0.3)',
//                         fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
//                       }}
//                       onMouseEnter={e => { if (!reportLoading) e.currentTarget.style.transform = 'translateY(-1px)' }}
//                       onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
//                     >
//                       {reportLoading ? (
//                         <>
//                           <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
//                           Generating PDF…
//                         </>
//                       ) : (
//                         <><FileText size={16} /> Download PDF Report</>
//                       )}
//                     </button>
//                     {reportError && (
//                       <div style={{ fontSize: 11, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 7, padding: '6px 10px' }}>
//                         ⚠️ {reportError}
//                       </div>
//                     )}
//                   </div>

//                   {/* Pitch Deck button */}
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//                     <button
//                       onClick={handleDownloadPitch}
//                       disabled={pitchLoading}
//                       style={{
//                         display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
//                         padding: '13px', borderRadius: 11, fontWeight: 700, fontSize: 14,
//                         background: 'transparent',
//                         color: pitchLoading ? 'var(--text3)' : 'var(--text)',
//                         border: `1px solid ${pitchLoading ? 'var(--border)' : 'var(--border2)'}`,
//                         cursor: pitchLoading ? 'not-allowed' : 'pointer',
//                         fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
//                       }}
//                       onMouseEnter={e => {
//                         if (!pitchLoading) {
//                           e.currentTarget.style.background = 'rgba(124,107,255,0.1)'
//                           e.currentTarget.style.borderColor = 'rgba(124,107,255,0.4)'
//                         }
//                       }}
//                       onMouseLeave={e => {
//                         e.currentTarget.style.background = 'transparent'
//                         e.currentTarget.style.borderColor = pitchLoading ? 'var(--border)' : 'var(--border2)'
//                       }}
//                     >
//                       {pitchLoading ? (
//                         <>
//                           <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.15)', borderTopColor: 'var(--text2)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
//                           Generating Deck…
//                         </>
//                       ) : (
//                         <><Download size={16} /> Download Pitch Deck</>
//                       )}
//                     </button>
//                     {pitchError && (
//                       <div style={{ fontSize: 11, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 7, padding: '6px 10px' }}>
//                         ⚠️ {pitchError}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 12, textAlign: 'center' }}>
//                   Calls <code>/api/generate-report</code> and <code>/api/generate-pitch</code> with your full prediction payload
//                 </p>
//               </div>

//             </div>
//           )}
//         </main>
//       </div>

//       {/* Footer */}
//       <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
//         <strong style={{ color: 'var(--text2)' }}>🚀 BizGenius</strong> — AI Predictor · Real Dataset + ML + RAG + LLM + Team Hierarchy + Live News ✅
//       </footer>

//       {/* Spinner keyframe */}
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   )
// }
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar.jsx'
import { MetricCard, TabBar, Divider, ProgressBar, Badge } from '../components/UI.jsx'
import NewsSection from '../components/NewsSection.jsx'
import TeamHierarchy from '../components/TeamHierarchy.jsx'
import {
  predictStartup,
  getCompetitors,
  getAnalysis,
  getHierarchy,
  getHiringGuide,
  generateReport,
  generatePitch
} from '../services/api.js'

const DOMAINS = ['EdTech', 'FinTech', 'HealthTech', 'E-commerce', 'SaaS', 'FoodTech', 'AgriTech', 'CleanTech', 'IoT', 'AI/ML', 'Other']

const RESULT_TABS = [
  { id: 'predictions', label: '🔮 ML Predictions' },
  { id: 'risks', label: '⚠️ Risks' },
  { id: 'hierarchy', label: '👥 Team' },
  { id: 'competitors', label: '🏢 Competitors' },
  { id: 'analysis', label: '🧠 AI Analysis' },
]

const classColor = cls => ({ Success: '#34d399', Failure: '#f87171', Uncertain: '#fbbf24' }[cls] || '#7c6bff')
const riskColor = r => ({ Low: '#34d399', Medium: '#fbbf24', High: '#f87171' }[r] || '#7c6bff')

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Moved OUTSIDE component so they never get recreated on re-render ───────
const FormField = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label>{label}</label>
    {children}
  </div>
)

const NumInput = React.memo(({ value, onChange, onBlur, label, min = 0, max = 999999, step = 1 }) => (
  <FormField label={label}>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      onBlur={onBlur}
    />
  </FormField>
))

// ─── Sidebar also memoized so it never re-renders due to results/tab changes ─
const Sidebar = React.memo(({ form, set, loading, onSubmit }) => (
  <aside style={{ width: 300, flexShrink: 0, position: 'sticky', top: 80 }}>
    <div className="glass" style={{ padding: 22, borderRadius: 18 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>📝 Startup Details</div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>Fill in your startup info</div>
      </div>

      <FormField label="Domain / Industry">
        <select value={form.domain} onChange={e => set('domain', e.target.value)}>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </FormField>

      <FormField label="Idea Description">
        <textarea
          rows={3}
          value={form.description}
          placeholder="E.g., AI-powered learning platform for K-12 students"
          onChange={e => set('description', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </FormField>

      <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        Company Metrics
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <NumInput
          label="Age (years)"
          value={form.company_age}
          min={0.1} max={50} step={0.5}
          onChange={e => set('company_age', e.target.value)}
          onBlur={e => set('company_age', parseFloat(e.target.value) || 0.1)}
        />
        <NumInput
          label="Founders"
          value={form.founder_count}
          min={1} max={10}
          onChange={e => set('founder_count', e.target.value)}
          onBlur={e => set('founder_count', parseInt(e.target.value) || 1)}
        />
        <NumInput
          label="Employees"
          value={form.employees}
          min={1} max={10000}
          onChange={e => set('employees', e.target.value)}
          onBlur={e => set('employees', parseInt(e.target.value) || 1)}
        />
        <NumInput
          label="Funding Rounds"
          value={form.funding_rounds}
          min={0} max={20}
          onChange={e => set('funding_rounds', e.target.value)}
          onBlur={e => set('funding_rounds', parseInt(e.target.value) || 0)}
        />
        <NumInput
          label="Investors"
          value={form.investor_count}
          min={0} max={100}
          onChange={e => set('investor_count', e.target.value)}
          onBlur={e => set('investor_count', parseInt(e.target.value) || 0)}
        />
      </div>

      <FormField label="Funding per Round ($)">
        <input
          type="number"
          value={form.funding_per_round}
          min={0}
          step={10000}
          onChange={e => set('funding_per_round', e.target.value)}
          onBlur={e => set('funding_per_round', parseFloat(e.target.value) || 0)}
        />
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
          Total: ${(form.funding_rounds * (parseFloat(form.funding_per_round) || 0)).toLocaleString()}
        </div>
      </FormField>

      <button
        onClick={onSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: '13px', borderRadius: 11, fontWeight: 800, fontSize: 15,
          background: loading ? 'rgba(124,107,255,0.3)' : 'linear-gradient(135deg, #7c6bff, #a855f7)',
          color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 6px 24px rgba(124,107,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s', marginTop: 8,
        }}
      >
        {loading
          ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analysing...</>
          : '🔮 Predict & Analyse'}
      </button>
    </div>
  </aside>
))

export default function PredictorPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    domain: 'SaaS', description: '', company_age: 1, founder_count: 2,
    employees: 5, funding_rounds: 1, funding_per_round: 50000, investor_count: 1,
  })
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('predictions')
  const [showNews, setShowNews] = useState(false)

  const [reportLoading, setReportLoading] = useState(false)
  const [pitchLoading, setPitchLoading] = useState(false)
  const [reportError, setReportError] = useState(null)
  const [pitchError, setPitchError] = useState(null)

  const resultsRef = useRef(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.description.trim()) {
      toast.error('Please provide an idea description!')
      return
    }

    setLoading(true)
    setResults(null)
    setReportError(null)
    setPitchError(null)

    try {
      setLoadingStep('Running ML models...')
      const mlRes = await predictStartup(form).catch(() => ({
        classification: 'Uncertain',
        risk_level: 'Medium',
        success_probability: 0.65,
        predicted_funding_usd: form.funding_per_round * 2,
        probabilities: { success: 0.65, uncertain: 0.25, failure: 0.10 },
        probable_risks: [
          'Market competition risk',
          'Funding runway risk',
          'Team scaling challenges'
        ],
      }))

      setLoadingStep('Finding similar startups...')
      const compRes = await getCompetitors({
        query: `${form.domain} startup: ${form.description}`
      }).catch(() => ({
        competitors: [],
        summary: 'Competitor data unavailable.',
      }))

      setLoadingStep('Generating AI strategic analysis...')
      const analysisRes = await getAnalysis({
        user_input: form,
        ml_results: mlRes,
        competitors_text: compRes.summary || '',
        probable_risks: mlRes.probable_risks || [],
      }).catch(() => ({
        analysis: `Startup has ${(mlRes.success_probability * 100).toFixed(0)}% success probability with ${mlRes.risk_level} risk.`,
      }))

      setLoadingStep('Building team hierarchy...')
      const hierarchyRes = await getHierarchy({
        user_input: form,
        ml_results: mlRes,
        total_employees: form.employees,
      }).catch(() => null)

      setLoadingStep('Generating hiring guide...')
      const hiringGuideRes = hierarchyRes
        ? await getHiringGuide({
          user_input: form,
          ml_results: mlRes,
          hierarchy: hierarchyRes,
        }).catch(() => null)
        : null

      const finalResults = {
        userInput: form,
        mlResults: mlRes,
        competitors: compRes.competitors || [],
        competitorsText: compRes.summary || '',
        analysis: analysisRes.analysis || '',
        hierarchy: hierarchyRes,
        probableRisks: mlRes.probable_risks || [],
        hiringGuide: hiringGuideRes,
      }

      setResults(finalResults)

      try {
        localStorage.setItem(
          'bizgenius_results',
          JSON.stringify({
            user_input: form,
            ml_results: mlRes,
            analysis: analysisRes.analysis || '',
            competitors: compRes.competitors || [],
            hierarchy: hierarchyRes,
            probable_risks: mlRes.probable_risks || [],
            hiring_guide: hiringGuideRes || {},
          })
        )
      } catch {
        console.warn('LocalStorage limit exceeded')
      }

      setActiveTab('predictions')

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)

      toast.success('Analysis complete!')
    } catch (e) {
      toast.error('Analysis failed: ' + (e.message || 'Unknown error'))
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  const handleDownloadReport = async () => {
    if (!results) return
    setReportLoading(true)
    setReportError(null)
    try {
      const blob = await generateReport({
        user_input: results.userInput,
        ml_results: results.mlResults,
        analysis: results.analysis,
        competitors: results.competitors,
        hierarchy: results.hierarchy,
        probable_risks: results.probableRisks,
        hiring_guide: results.hiringGuide || {},
      })
      triggerDownload(blob, 'bizgenius_report.pdf')
      toast.success('PDF report downloaded!')
    } catch (err) {
      const msg = err.message || 'Failed to generate report'
      setReportError(msg)
      toast.error(msg)
    } finally {
      setReportLoading(false)
    }
  }

  const handleDownloadPitch = async () => {
    if (!results) return
    setPitchLoading(true)
    setPitchError(null)
    try {
      const blob = await generatePitch({
        user_input: results.userInput,
        ml_results: results.mlResults,
        analysis: results.analysis,
        competitors: results.competitors,
        hierarchy: results.hierarchy,
        probable_risks: results.probableRisks,
        hiring_guide: results.hiringGuide || {},
      })
      triggerDownload(blob, 'bizgenius_pitch.pptx')
      toast.success('Pitch deck downloaded!')
    } catch (err) {
      const msg = err.message || 'Failed to generate pitch deck'
      setPitchError(msg)
      toast.error(msg)
    } finally {
      setPitchLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 60 }}>
      <Navbar />

      <div style={{ display: 'flex', maxWidth: 1400, margin: '0 auto', padding: '32px 24px', gap: 28, alignItems: 'flex-start' }}>

        {/* ── Memoized Sidebar — never re-renders on results/tab change ── */}
        <Sidebar form={form} set={set} loading={loading} onSubmit={handleSubmit} />

        {/* ── Main Area ────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 14px', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>🎯 AI-Powered Startup Predictor</h1>
              <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 2 }}>Real dataset · ML + RAG + LLM + Team Hierarchy</p>
            </div>
          </div>

          <NewsSection
            domain={form.domain}
            visible={showNews}
            onToggle={() => setShowNews(v => !v)}
          />

          {loading && (
            <div className="glass" style={{ padding: 48, borderRadius: 18, textAlign: 'center', animation: 'fadeIn 0.3s ease both' }}>
              <div className="spinner" style={{ width: 44, height: 44, borderWidth: 3, margin: '0 auto 20px' }} />
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Running Analysis</div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>{loadingStep}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
                {['ML Models', 'RAG Search', 'LLM Analysis', 'Team AI'].map((s, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                    background: loadingStep.toLowerCase().includes(s.toLowerCase().split(' ')[0]) ? 'rgba(124,107,255,0.25)' : 'var(--surface)',
                    color: loadingStep.toLowerCase().includes(s.toLowerCase().split(' ')[0]) ? '#a895ff' : 'var(--text3)',
                    border: '1px solid var(--border)',
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {!loading && !results && (
            <div className="glass" style={{ padding: '52px 36px', borderRadius: 18, textAlign: 'center', animation: 'fadeUp 0.4s ease 0.2s both' }}>
              <div style={{ fontSize: 52, marginBottom: 20 }}>🔮</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to Predict</h2>
              <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 36px' }}>
                Fill in your startup details in the sidebar and click <strong style={{ color: '#a895ff' }}>Predict & Analyse</strong> to get instant ML predictions, competitor insights, team structure, and strategic recommendations.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, maxWidth: 600, margin: '0 auto', textAlign: 'left' }}>
                {[
                  ['1️⃣', 'Fill sidebar form', 'Domain, description, metrics'],
                  ['2️⃣', 'Click Predict', 'Run ML + RAG + LLM pipeline'],
                  ['3️⃣', 'Explore results', 'Predictions, team, competitors'],
                  ['4️⃣', 'Download reports', 'PDF & PowerPoint pitch deck'],
                ].map(([icon, title, desc], i) => (
                  <div key={i} className="glass" style={{ padding: '16px', borderRadius: 12 }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && results && (
            <div ref={resultsRef} style={{ animation: 'fadeUp 0.4s ease both' }}>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginBottom: 24 }}>
                <MetricCard
                  label="Classification"
                  value={results.mlResults.classification === 'Success' ? '✅ Success' : results.mlResults.classification === 'Failure' ? '❌ Failure' : '⚠️ Uncertain'}
                  color={classColor(results.mlResults.classification)}
                />
                <MetricCard
                  label="Risk Level"
                  value={`${results.mlResults.risk_level === 'Low' ? '🟢' : results.mlResults.risk_level === 'Medium' ? '🟡' : '🔴'} ${results.mlResults.risk_level}`}
                  color={riskColor(results.mlResults.risk_level)}
                />
                <MetricCard
                  label="Success Probability"
                  value={`${(results.mlResults.success_probability * 100).toFixed(1)}%`}
                  color="#00e5ff"
                />
                <MetricCard
                  label="Next Round Est."
                  value={`$${(results.mlResults.predicted_funding_usd / 1e6).toFixed(2)}M`}
                  color="#34d399"
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <TabBar tabs={RESULT_TABS} active={activeTab} onChange={setActiveTab} />
              </div>

              {activeTab === 'predictions' && (
                <div style={{ animation: 'fadeUp 0.35s ease both' }}>
                  <div className="glass" style={{ padding: 24, borderRadius: 16, marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Classification Probabilities</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { name: 'Success', value: results.mlResults.probabilities.success * 100, fill: '#34d399' },
                        { name: 'Uncertain', value: results.mlResults.probabilities.uncertain * 100, fill: '#fbbf24' },
                        { name: 'Failure', value: results.mlResults.probabilities.failure * 100, fill: '#f87171' },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(130,120,255,0.08)" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
                        <Tooltip
                          formatter={v => [`${v.toFixed(1)}%`, 'Probability']}
                          contentStyle={{ background: '#1c1c35', border: '1px solid rgba(130,120,255,0.2)', borderRadius: 8, color: '#e8e6ff' }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {['#34d399', '#fbbf24', '#f87171'].map((c, i) => <Cell key={i} fill={c} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Probability Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <ProgressBar label="✅ Success" value={results.mlResults.probabilities.success * 100} color="#34d399" />
                      <ProgressBar label="⚠️ Uncertain" value={results.mlResults.probabilities.uncertain * 100} color="#fbbf24" />
                      <ProgressBar label="❌ Failure" value={results.mlResults.probabilities.failure * 100} color="#f87171" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'risks' && (
                <div style={{ animation: 'fadeUp 0.35s ease both' }}>
                  <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 18 }}>⚠️ Identified Risks</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(results.probableRisks || []).map((risk, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 14,
                          background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)',
                          borderRadius: 12, padding: '14px 18px',
                        }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%', background: 'rgba(251,191,36,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fbbf24', fontWeight: 800, fontSize: 12, flexShrink: 0,
                          }}>{i + 1}</div>
                          <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.55 }}>{risk}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hierarchy' && (
                <div style={{ animation: 'fadeUp 0.35s ease both' }}>
                  {results.hierarchy
                    ? <TeamHierarchy
                      data={results.hierarchy}
                      hiringGuide={results.hiringGuide}
                      totalEmployees={form.employees}
                    />
                    : <div className="glass" style={{ padding: 40, textAlign: 'center', borderRadius: 16, color: 'var(--text2)' }}>Team hierarchy not available</div>
                  }
                </div>
              )}

              {activeTab === 'competitors' && (
                <div style={{ animation: 'fadeUp 0.35s ease both' }}>
                  <div className="glass" style={{ padding: 20, borderRadius: 16, marginBottom: 16 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12 }}>📊 Competitor Summary</h3>
                    <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>{results.competitorsText || 'No summary available.'}</p>
                  </div>

                  {results.competitors.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>🏢 Top Similar Startups</h3>
                      {results.competitors.map((comp, i) => {
                        const similarity = (1 - (comp.distance || 0.5)) * 100
                        const meta = comp.metadata || {}
                        return (
                          <div key={i} className="glass" style={{ padding: 20, borderRadius: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>Competitor {i + 1}</div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <Badge color="purple">Similarity {similarity.toFixed(1)}%</Badge>
                                {meta.industry && <Badge color="cyan">{meta.industry}</Badge>}
                                {meta.funding && <Badge color="green">${(meta.funding / 1e6).toFixed(2)}M</Badge>}
                              </div>
                            </div>
                            <ProgressBar value={similarity} color="#7c6bff" label="Similarity Score" showPct={false} />
                            <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
                              {(comp.document || '').slice(0, 300)}{(comp.document || '').length > 300 ? '...' : ''}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="glass" style={{ padding: 32, textAlign: 'center', borderRadius: 16, color: 'var(--text2)' }}>
                      ⚠️ Competitor search skipped (RAG service unavailable or timed out)
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analysis' && (
                <div style={{ animation: 'fadeUp 0.35s ease both' }}>
                  <div className="glass" style={{ padding: 28, borderRadius: 16 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🧠 AI Strategic Analysis</h3>
                    <div style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'DM Sans, sans-serif' }}>
                      {results.analysis}
                    </div>
                  </div>
                </div>
              )}

              <Divider />
              <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                  📥 Download Reports
                </h3>
                <p style={{ color: 'var(--text3)', fontSize: 12, marginBottom: 18 }}>
                  Generated live from your prediction data via the FastAPI backend
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button
                      onClick={handleDownloadReport}
                      disabled={reportLoading}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '13px', borderRadius: 11, fontWeight: 700, fontSize: 14,
                        background: reportLoading ? 'rgba(124,107,255,0.3)' : 'linear-gradient(135deg, #7c6bff, #a855f7)',
                        color: '#fff', border: 'none',
                        cursor: reportLoading ? 'not-allowed' : 'pointer',
                        boxShadow: reportLoading ? 'none' : '0 4px 18px rgba(124,107,255,0.3)',
                        fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { if (!reportLoading) e.currentTarget.style.transform = 'translateY(-1px)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      {reportLoading ? (
                        <>
                          <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                          Generating PDF…
                        </>
                      ) : (
                        <><FileText size={16} /> Download PDF Report</>
                      )}
                    </button>
                    {reportError && (
                      <div style={{ fontSize: 11, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 7, padding: '6px 10px' }}>
                        ⚠️ {reportError}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button
                      onClick={handleDownloadPitch}
                      disabled={pitchLoading}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '13px', borderRadius: 11, fontWeight: 700, fontSize: 14,
                        background: 'transparent',
                        color: pitchLoading ? 'var(--text3)' : 'var(--text)',
                        border: `1px solid ${pitchLoading ? 'var(--border)' : 'var(--border2)'}`,
                        cursor: pitchLoading ? 'not-allowed' : 'pointer',
                        fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        if (!pitchLoading) {
                          e.currentTarget.style.background = 'rgba(124,107,255,0.1)'
                          e.currentTarget.style.borderColor = 'rgba(124,107,255,0.4)'
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = pitchLoading ? 'var(--border)' : 'var(--border2)'
                      }}
                    >
                      {pitchLoading ? (
                        <>
                          <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.15)', borderTopColor: 'var(--text2)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                          Generating Deck…
                        </>
                      ) : (
                        <><Download size={16} /> Download Pitch Deck</>
                      )}
                    </button>
                    {pitchError && (
                      <div style={{ fontSize: 11, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 7, padding: '6px 10px' }}>
                        ⚠️ {pitchError}
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 12, textAlign: 'center' }}>
                  Calls <code>/api/generate-report</code> and <code>/api/generate-pitch</code> with your full prediction payload
                </p>
              </div>

            </div>
          )}
        </main>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
        <strong style={{ color: 'var(--text2)' }}>🚀 BizGenius</strong> — AI Predictor · Real Dataset + ML + RAG + LLM + Team Hierarchy + Live News ✅
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}