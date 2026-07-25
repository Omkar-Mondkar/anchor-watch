import { createTheme } from '@mui/material/styles';

// ConfigGuard dark operational theme
// Colours from PRD §14 UI/UX Requirements
const configGuardTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B1220',
      paper:   '#111827',
    },
    primary: {
      main: '#3B82F6',
      contrastText: '#ffffff',
    },
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    text: {
      primary:   '#E2E8F0',
      secondary: '#64748B',
    },
    divider: '#1E293B',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0B1220',
          scrollbarColor: '#1E293B #0B1220',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: '#0B1220' },
          '&::-webkit-scrollbar-thumb': { background: '#1E293B', borderRadius: '4px' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
          border: '1px solid #1E293B',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#1E293B',
        },
        head: {
          backgroundColor: '#0B1220',
          color: '#64748B',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0B1220',
          borderRight: '1px solid #1E293B',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          borderBottom: '1px solid #1E293B',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default configGuardTheme;
