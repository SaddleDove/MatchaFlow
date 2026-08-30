import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { AIInsightsPage } from '@/pages/AIInsightsPage'
import { WeeklyReportPage } from '@/pages/WeeklyReportPage'
import { useStore } from '@/lib/store'

export default function App() {
  const setCommandPaletteOpen = useStore((s) => s.setCommandPaletteOpen)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCommandPaletteOpen])

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectsPage />} />
        <Route path="/insights" element={<AIInsightsPage />} />
        <Route path="/reports" element={<WeeklyReportPage />} />
      </Route>
    </Routes>
  )
}
