import { Box, Typography, Paper, Chip } from '@mui/material'
import { Dns } from '@mui/icons-material'

export default function Servers() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Dns sx={{ color: '#3B82F6', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">Servers</Typography>
          <Typography variant="body2" color="text.secondary">
            Onboard and manage infrastructure servers
          </Typography>
        </Box>
      </Box>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Chip label="Change 3 — Server Onboarding & Enrollment" sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Server list, onboarding form, and enrollment token management will be implemented in Change 3.
        </Typography>
      </Paper>
    </Box>
  )
}
