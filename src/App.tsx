import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { ArchivePage } from './pages/ArchivePage'
import { JournalPage } from './pages/JournalPage'
import { LoginPage } from './pages/LoginPage'
import { OverviewPage } from './pages/OverviewPage'
import { PursuitDetailPage } from './pages/PursuitDetailPage'
import { PursuitsPage } from './pages/PursuitsPage'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<JournalPage />} />
        <Route path="/pursuits" element={<PursuitsPage />} />
        <Route path="/pursuits/:id" element={<PursuitDetailPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/archive" element={<ArchivePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
