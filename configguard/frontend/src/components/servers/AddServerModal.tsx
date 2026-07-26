import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { registerServer, RegisterServerData, RegisterServerResponse } from '../../api/serverApi';

interface AddServerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (response: RegisterServerResponse) => void;
}

export default function AddServerModal({ open, onClose, onSuccess }: AddServerModalProps) {
  const [formData, setFormData] = useState<RegisterServerData>({
    hostname: '',
    ip: '',
    environment: 'production',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await registerServer(formData);
      onSuccess(response);
      setFormData({ hostname: '', ip: '', environment: 'production' });
    } catch (err: any) {
      setError(err.message || 'Failed to register server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={!loading ? onClose : undefined} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Server</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Hostname"
            fullWidth
            required
            value={formData.hostname}
            onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="IP Address"
            fullWidth
            required
            value={formData.ip}
            onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
            disabled={loading}
            sx={{ mt: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Environment"
            fullWidth
            required
            value={formData.environment}
            onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            <MenuItem value="production">Production</MenuItem>
            <MenuItem value="staging">Staging</MenuItem>
            <MenuItem value="development">Development</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add Server'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
