import { Box, Typography, Paper, Chip } from '@mui/material'
import { CompareArrows } from '@mui/icons-material'

export default function DriftAnalyzer() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CompareArrows sx={{ color: '#F59E0B', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">Drift Analyzer</Typography>
          <Typography variant="body2" color="text.secondary">
            Visual diff analysis — Live state vs baseline
          </Typography>
        </Box>
      </Box>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Chip label="Change 7 — Diff Query API" sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Side-by-side, inline, and JSON diff viewer will be implemented in Change 7.
        </Typography>
      </Paper>
    </Box>
  )
}
