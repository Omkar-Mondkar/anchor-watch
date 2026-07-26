import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';

interface TokenDisplayModalProps {
  open: boolean;
  onClose: () => void;
  token: string;
  hostname: string;
}

export default function TokenDisplayModal({ open, onClose, token, hostname }: TokenDisplayModalProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(token);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'success.main' }}>Server Registered Successfully!</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          Server <strong>{hostname}</strong> has been onboarded. To enroll the agent, you need the following one-time token.
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please copy this token now. It will not be shown again for security reasons.
        </Alert>

        <Box sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1,
          fontFamily: 'monospace',
          wordBreak: 'break-all',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2" sx={{ fontFamily: 'inherit' }}>
            {token}
          </Typography>
          <Button size="small" variant="outlined" onClick={handleCopy} sx={{ ml: 2, flexShrink: 0 }}>
            Copy
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Run the following command on the server to complete enrollment:
        </Typography>
        <Box sx={{ 
          p: 1.5, 
          mt: 1,
          bgcolor: 'grey.900', 
          color: 'grey.100',
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '0.85rem'
        }}>
          python collector.py --server-id &lt;ID&gt; --api-url &lt;URL&gt; --enroll-token {token}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          I have copied the token
        </Button>
      </DialogActions>
    </Dialog>
  );
}
