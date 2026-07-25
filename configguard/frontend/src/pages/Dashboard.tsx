import { Box, Typography, Grid, Paper, Chip } from '@mui/material'
import { CheckCircle, Warning, Error as ErrorIcon, Dns } from '@mui/icons-material'

// Placeholder stat card component
function StatCard({ title, value, icon, color }: {
  title: string; value: string | number; icon: React.ReactNode; color: string
}) {
  return (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ color, display: 'flex', alignItems: 'center', fontSize: 40 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={700} color="text.primary">{value}</Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
      </Box>
    </Paper>
  )
}

export default function Dashboard() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Operations Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Fleet-wide configuration health overview
        </Typography>
      </Box>

      {/* Summary stats — will be driven by API data in Change 11 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Servers" value="—" icon={<Dns fontSize="inherit" />} color="#3B82F6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Compliant" value="—" icon={<CheckCircle fontSize="inherit" />} color="#22C55E" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Drifted" value="—" icon={<Warning fontSize="inherit" />} color="#F59E0B" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Critical Alerts" value="—" icon={<ErrorIcon fontSize="inherit" />} color="#EF4444" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Chip label="Change 11 — Compliance Dashboard API" sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Dashboard charts and server health table will be populated after Change 11 is implemented.
        </Typography>
      </Paper>
    </Box>
  )
}
