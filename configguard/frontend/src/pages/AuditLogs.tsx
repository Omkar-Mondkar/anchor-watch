import { Box, Typography, Paper, Chip } from '@mui/material'
import { History } from '@mui/icons-material'

export default function AuditLogs() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <History sx={{ color: '#64748B', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">Audit Logs</Typography>
          <Typography variant="body2" color="text.secondary">
            Immutable change timeline and user activity log
          </Typography>
        </Box>
      </Box>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Chip label="Change 9 — Audit Trail" sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Append-only audit log with timeline view, user activity, and export will be implemented in Change 9.
        </Typography>
      </Paper>
    </Box>
  )
}
