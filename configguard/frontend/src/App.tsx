import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import Servers from './pages/Servers'
import Baselines from './pages/Baselines'
import DriftAnalyzer from './pages/DriftAnalyzer'
import Alerts from './pages/Alerts'
import AuditLogs from './pages/AuditLogs'

const SIDEBAR_WIDTH = 240

export default function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar navigation */}
      <Sidebar width={SIDEBAR_WIDTH} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/servers"   element={<Servers />} />
            <Route path="/baselines" element={<Baselines />} />
            <Route path="/drift"     element={<DriftAnalyzer />} />
            <Route path="/alerts"    element={<Alerts />} />
            <Route path="/audit"     element={<AuditLogs />} />
            {/* Catch-all — redirect to dashboard */}
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}
