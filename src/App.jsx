import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import PredictorPage from './pages/PredictorPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="noise" />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c1c35',
            color: '#e8e6ff',
            border: '1px solid rgba(130,120,255,0.2)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/predictor" element={<PredictorPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}