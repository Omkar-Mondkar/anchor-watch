import { useLocation, useNavigate } from 'react-router-dom'
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Box, Divider, Chip
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Dns,
  AccountTree,
  CompareArrows,
  NotificationsActive,
  History,
  Shield,
} from '@mui/icons-material'

const navItems = [
  { label: 'Dashboard',      path: '/',          icon: <DashboardIcon />,      color: '#3B82F6' },
  { label: 'Servers',        path: '/servers',   icon: <Dns />,                color: '#3B82F6' },
  { label: 'Baselines',      path: '/baselines', icon: <AccountTree />,        color: '#22C55E' },
  { label: 'Drift Analyzer', path: '/drift',     icon: <CompareArrows />,      color: '#F59E0B' },
  { label: 'Alerts',         path: '/alerts',    icon: <NotificationsActive />,color: '#EF4444' },
  { label: 'Audit Logs',     path: '/audit',     icon: <History />,            color: '#64748B' },
]

interface SidebarProps {
  width: number
}

export default function Sidebar({ width }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Shield sx={{ color: '#3B82F6', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1.1}>
            ConfigGuard
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Config Governance
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1, pt: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.18)' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? item.color : 'text.secondary',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'text.primary' : 'text.secondary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Chip
          label="v1.0.0 — Phase 1"
          size="small"
          sx={{ fontSize: '0.7rem', color: 'text.secondary', borderColor: 'divider' }}
          variant="outlined"
        />
      </Box>
    </Drawer>
  )
}
