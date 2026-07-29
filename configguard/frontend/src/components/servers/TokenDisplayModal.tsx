import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

interface TokenDisplayModalProps {
  open: boolean;
  onClose: () => void;
  token: string;
  hostname: string;
  serverId: string;
}

export default function TokenDisplayModal({ open, onClose, token, hostname, serverId }: TokenDisplayModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
  };

  const enrollCommand = `python enrollment.py --server-id ${serverId} --api-url http://<YOUR_HOST>:5000/api --enroll-token ${token}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: 'success.main' }}>Server Registered Successfully!</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          Server <strong>{hostname}</strong> has been onboarded.
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please copy the token and command below now. The token will not be shown again.
        </Alert>

        {/* Server ID */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          Server ID
        </Typography>
        <Box sx={{ 
          p: 1.5, mb: 2,
          bgcolor: 'background.paper', 
          border: '1px solid', borderColor: 'divider', borderRadius: 1,
          fontFamily: 'monospace', fontSize: '0.9rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span>{serverId}</span>
          <Button size="small" variant="outlined" startIcon={<ContentCopy />}
            onClick={() => handleCopy(serverId, 'Server ID')} sx={{ ml: 2, flexShrink: 0 }}>
            Copy
          </Button>
        </Box>

        {/* Enrollment Token */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          One-Time Enrollment Token
        </Typography>
        <Box sx={{ 
          p: 1.5, mb: 2,
          bgcolor: 'background.paper', 
          border: '1px solid', borderColor: 'divider', borderRadius: 1,
          fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span>{token}</span>
          <Button size="small" variant="outlined" startIcon={<ContentCopy />}
            onClick={() => handleCopy(token, 'Token')} sx={{ ml: 2, flexShrink: 0 }}>
            Copy
          </Button>
        </Box>

        {/* Enrollment Command */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          Enrollment Command (run on the target server)
        </Typography>
        <Box sx={{ 
          p: 1.5, 
          bgcolor: 'grey.900', color: 'grey.100',
          borderRadius: 1, fontFamily: 'monospace', fontSize: '0.82rem',
          wordBreak: 'break-all', position: 'relative'
        }}>
          {enrollCommand}
          <Button size="small" variant="outlined" startIcon={<ContentCopy />}
            onClick={() => handleCopy(enrollCommand, 'Command')}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.300', borderColor: 'grey.600' }}>
            Copy
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Replace <code>&lt;YOUR_HOST&gt;</code> with the IP or hostname where ConfigGuard is running.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          I have copied the token
        </Button>
      </DialogActions>

      <Snackbar
        open={!!copied}
        autoHideDuration={2000}
        onClose={() => setCopied(null)}
        message={`${copied} copied to clipboard`}
      />
    </Dialog>
  );
}

