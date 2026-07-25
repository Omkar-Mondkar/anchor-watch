import { Box, Typography, Paper, Chip } from '@mui/material'
import { AccountTree } from '@mui/icons-material'

export default function Baselines() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AccountTree sx={{ color: '#3B82F6', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">Baselines</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage configuration baseline versions
          </Typography>
        </Box>
      </Box>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Chip label="Change 5 — Baseline Management" sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Baseline creation, versioning, approval workflow, and profile-level baselines will be implemented in Change 5.
        </Typography>
      </Paper>
    </Box>
  )
}
