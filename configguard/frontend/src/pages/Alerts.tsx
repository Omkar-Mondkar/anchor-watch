import { Box, Typography, Paper, Chip } from '@mui/material'
import { NotificationsActive } from '@mui/icons-material'

export default function Alerts() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <NotificationsActive sx={{ color: '#EF4444', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">Alerts</Typography>
          <Typography variant="body2" color="text.secondary">
            Active drift alerts and monitoring tool dispatch history
          </Typography>
        </Box>
      </Box>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Chip label="Change 8 — Severity & Alerting" sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Alert list, severity classification, monitoring tool integration, and webhook management will be implemented in Change 8.
        </Typography>
      </Paper>
    </Box>
  )
}
