import { AppBar, Toolbar, Typography, Box, IconButton, Chip, Tooltip } from '@mui/material'
import { Notifications, AccountCircle, Refresh } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/':          { title: 'Operations Dashboard', subtitle: 'Fleet-wide health overview' },
  '/servers':   { title: 'Servers',              subtitle: 'Infrastructure server management' },
  '/baselines': { title: 'Baselines',            subtitle: 'Configuration baseline versions' },
  '/drift':     { title: 'Drift Analyzer',       subtitle: 'Live state vs baseline comparison' },
  '/alerts':    { title: 'Alerts',               subtitle: 'Active drift alerts' },
  '/audit':     { title: 'Audit Logs',           subtitle: 'Immutable change timeline' },
}

export default function Header() {
  const location = useLocation()
  const pageInfo = pageTitles[location.pathname] ?? { title: 'ConfigGuard', subtitle: '' }
  const now = new Date().toLocaleString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Page title */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={600} color="text.primary" lineHeight={1.2}>
            {pageInfo.title}
          </Typography>
          {pageInfo.subtitle && (
            <Typography variant="caption" color="text.secondary">
              {pageInfo.subtitle}
            </Typography>
          )}
        </Box>

        {/* Current time */}
        <Chip
          label={now}
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.7rem', color: 'text.secondary', borderColor: 'divider' }}
        />

        {/* Actions */}
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={() => window.location.reload()}>
            <Refresh fontSize="small" sx={{ color: 'text.secondary' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Alerts">
          <IconButton size="small">
            <Notifications fontSize="small" sx={{ color: 'text.secondary' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Account">
          <IconButton size="small">
            <AccountCircle fontSize="small" sx={{ color: 'text.secondary' }} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}
