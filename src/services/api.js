// // services/api.js
// // All backend calls go through this service.
// // The Vite proxy rewrites /api → http://localhost:8000
// // so the FastAPI (or Flask) backend just needs to run on :8000.

// const BASE = '/api'

// async function request(endpoint, options = {}) {
//   const res = await fetch(`${BASE}${endpoint}`, {
//     headers: { 'Content-Type': 'application/json', ...options.headers },
//     ...options,
//   })
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({ detail: res.statusText }))
//     throw new Error(err.detail || 'Request failed')
//   }
//   return res.json()
// }

// // ─── ML Prediction ───────────────────────────────────────────
// // POST /predict
// // Body: { domain, description, company_age, founder_count,
// //         employees, funding_rounds, funding_per_round, investor_count }
// // Returns: { classification, risk_level, success_probability,
// //            predicted_funding_usd, probabilities, probable_risks }
// export const predictStartup = (payload) =>
//   request('/predict', { method: 'POST', body: JSON.stringify(payload) })

// // ─── Competitors (RAG) ───────────────────────────────────────
// // POST /competitors
// // Body: { query }
// // Returns: { competitors: [...], summary: string }
// export const getCompetitors = (payload) =>
//   request('/competitors', { method: 'POST', body: JSON.stringify(payload) })

// // ─── LLM Strategic Analysis ──────────────────────────────────
// // POST /analyze
// // Body: { user_input, ml_results, competitors_text, probable_risks }
// // Returns: { analysis: string }
// export const getAnalysis = (payload) =>
//   request('/analyze', { method: 'POST', body: JSON.stringify(payload) })

// // ─── Team Hierarchy (LLM) ────────────────────────────────────
// // POST /hierarchy
// // Body: { user_input, ml_results, total_employees }
// // Returns: full hierarchy JSON (same shape as the Python generate_team_hierarchy fn)
// export const getHierarchy = (payload) =>
//   request('/hierarchy', { method: 'POST', body: JSON.stringify(payload) })

// // ─── News ────────────────────────────────────────────────────
// // GET /news?domain=EdTech
// // Returns: { articles: [...] }
// export const getNews = (domain) =>
//   request(`/news?domain=${encodeURIComponent(domain)}`)

// // ─── Analytics Dataset ───────────────────────────────────────
// // GET /analytics
// // Returns: { data: [...] }   (synthetic_startups.csv rows as JSON)
// export const getAnalyticsData = () => request('/analytics')

// services/api.js
// All backend calls go through this service.
// The Vite proxy rewrites /api → http://localhost:8000
// so the FastAPI backend just needs to run on :8000.

// const BASE = '/api'

// async function request(endpoint, options = {}) {
//   const res = await fetch(`${BASE}${endpoint}`, {
//     headers: { 'Content-Type': 'application/json', ...options.headers },
//     ...options,
//   })
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({ detail: res.statusText }))
//     throw new Error(err.detail || 'Request failed')
//   }
//   return res.json()
// }

// // ─── ML Prediction ───────────────────────────────────────────
// // POST /predict
// // Body: { domain, description, company_age, founder_count,
// //         employees, funding_rounds, funding_per_round, investor_count }
// // Returns: { classification, risk_level, success_probability,
// //            predicted_funding_usd, probabilities, probable_risks }
// export const predictStartup = (payload) =>
//   request('/predict', { method: 'POST', body: JSON.stringify(payload) })

// // ─── Competitors (RAG) ───────────────────────────────────────
// // POST /competitors
// // Body: { query }
// // Returns: { competitors: [...], summary: string }
// export const getCompetitors = (payload) =>
//   request('/competitors', { method: 'POST', body: JSON.stringify(payload) })

// // ─── LLM Strategic Analysis ──────────────────────────────────
// // POST /analyze
// // Body: { user_input, ml_results, competitors_text, probable_risks }
// // Returns: { analysis: string }
// export const getAnalysis = (payload) =>
//   request('/analyze', { method: 'POST', body: JSON.stringify(payload) })

// // ─── Team Hierarchy (LLM) ────────────────────────────────────
// // POST /hierarchy
// // Body: { user_input, ml_results, total_employees }
// // Returns: full hierarchy JSON
// export const getHierarchy = (payload) =>
//   request('/hierarchy', { method: 'POST', body: JSON.stringify(payload) })

// // ─── News ────────────────────────────────────────────────────
// // GET /news?domain=EdTech
// // Returns: { articles: [{ title, description, url, source, published }] }
// // Backend filters articles to only those relevant to the domain keyword
// export const getNews = (domain) =>
//   request(`/news?domain=${encodeURIComponent(domain)}`)

// // ─── Analytics Dataset ───────────────────────────────────────
// // GET /analytics
// // Returns: { data: [...] }  (synthetic_startups.csv rows as JSON)
// export const getAnalyticsData = () => request('/analytics')

// // ─── Generate PDF Report ─────────────────────────────────────
// export const generateReport = (payload) =>
//   fetch('/api/generate-report', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   }).then(res => {
//     if (!res.ok) throw new Error('Report generation failed')
//     return res.blob()
//   })

// // ─── Generate Pitch Deck ─────────────────────────────────────
// export const generatePitch = (payload) =>
//   fetch('/api/generate-pitch', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   }).then(res => {
//     if (!res.ok) throw new Error('Pitch generation failed')
//     return res.blob()
//   })

const BASE = '/api'

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

// ─── ML Prediction ───────────────────────────────────────────
// POST /predict
// Body: { domain, description, company_age, founder_count,
//         employees, funding_rounds, funding_per_round, investor_count }
// Returns: { classification, risk_level, success_probability,
//            predicted_funding_usd, probabilities, probable_risks }
export const predictStartup = (payload) =>
  request('/predict', { method: 'POST', body: JSON.stringify(payload) })

// ─── Competitors (RAG) ───────────────────────────────────────
// POST /competitors
// Body: { query }
// Returns: { competitors: [...], summary: string }
export const getCompetitors = (payload) =>
  request('/competitors', { method: 'POST', body: JSON.stringify(payload) })

// ─── LLM Strategic Analysis ──────────────────────────────────
// POST /analyze
// Body: { user_input, ml_results, competitors_text, probable_risks }
// Returns: { analysis: string }
export const getAnalysis = (payload) =>
  request('/analyze', { method: 'POST', body: JSON.stringify(payload) })

// ─── Team Hierarchy (LLM) ────────────────────────────────────
// POST /hierarchy
// Body: { user_input, ml_results, total_employees }
// Returns: { ceo_title, total_employees, departments: [{ name, headcount, roles, skills_needed }],
//            hiring_gaps, recommended_next_hires: [{ role, priority, reason }], org_insight }
export const getHierarchy = (payload) =>
  request('/hierarchy', { method: 'POST', body: JSON.stringify(payload) })

// ─── Hiring Guide (LLM) ──────────────────────────────────────
// POST /hiring-guide
// Body: { user_input, ml_results, hierarchy }
// Returns: { hiring_profiles: [{ role, department, priority, seniority, experience_years,
//              salary_range, must_have_skills, nice_to_have_skills, qualifications,
//              key_responsibilities, interview_signals, why_critical }],
//            hiring_sequence: [{ order, role, rationale }],
//            culture_fit_signals: [...], onboarding_tips: string }
export const getHiringGuide = (payload) =>
  request('/hiring-guide', { method: 'POST', body: JSON.stringify(payload) })

// ─── News ────────────────────────────────────────────────────
// GET /news?domain=EdTech
// Returns: { articles: [{ title, description, url, source, published }] }
// Backend filters articles to only those relevant to the domain keyword
export const getNews = (domain) =>
  request(`/news?domain=${encodeURIComponent(domain)}`)

// ─── Analytics Dataset ───────────────────────────────────────
// GET /analytics
// Returns: { data: [...] }  (synthetic_startups.csv rows as JSON)
export const getAnalyticsData = () => request('/analytics')

// ─── Generate PDF Report ─────────────────────────────────────
export const generateReport = (payload) =>
  fetch('/api/generate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error('Report generation failed')
    return res.blob()
  })

// ─── Generate Pitch Deck ─────────────────────────────────────
export const generatePitch = (payload) =>
  fetch('/api/generate-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error('Pitch generation failed')
    return res.blob()
  })