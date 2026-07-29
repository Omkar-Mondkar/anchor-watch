import { useState, useEffect } from 'react'
import { 
  Box, Typography, Button, Paper, IconButton, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { Dns, Add, Delete } from '@mui/icons-material'
import { getServers, deleteServer, Server, RegisterServerResponse } from '../api/serverApi'
import AddServerModal from '../components/servers/AddServerModal'
import TokenDisplayModal from '../components/servers/TokenDisplayModal'

export default function Servers() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  
  const [addModalOpen, setAddModalOpen] = useState(false)
  
  const [tokenModalOpen, setTokenModalOpen] = useState(false)
  const [newToken, setNewToken] = useState('')
  const [newHostname, setNewHostname] = useState('')
  const [newServerId, setNewServerId] = useState('')

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [serverToDelete, setServerToDelete] = useState<Server | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchServers = async () => {
    setLoading(true)
    try {
      const data = await getServers()
      setServers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServers()
  }, [])

  const handleAddSuccess = (response: RegisterServerResponse) => {
    setAddModalOpen(false)
    setNewToken(response.enrollmentToken)
    setNewHostname(response.server.hostname)
    setNewServerId(response.server.id)
    setTokenModalOpen(true)
    fetchServers()
  }

  const handleDeleteClick = (server: Server) => {
    setServerToDelete(server)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!serverToDelete) return
    setDeleting(true)
    try {
      await deleteServer(serverToDelete._id)
      fetchServers()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
      setDeleteConfirmOpen(false)
      setServerToDelete(null)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Dns sx={{ color: '#3B82F6', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">Servers</Typography>
            <Typography variant="body2" color="text.secondary">
              Onboard and manage infrastructure servers
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setAddModalOpen(true)}
        >
          Add Server
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Hostname</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Environment</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Added</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : servers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No servers onboarded yet. Click "Add Server" to begin.
                </TableCell>
              </TableRow>
            ) : (
              servers.map((server) => (
                <TableRow key={server._id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{server.hostname}</TableCell>
                  <TableCell>{server.ip}</TableCell>
                  <TableCell>
                    <Chip 
                      label={server.environment} 
                      size="small" 
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={server.enrollmentStatus} 
                      size="small" 
                      color={server.enrollmentStatus === 'enrolled' ? 'success' : 'warning'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {new Date(server.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete server">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteClick(server)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddServerModal 
        open={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSuccess={handleAddSuccess}
      />
      
      <TokenDisplayModal 
        open={tokenModalOpen} 
        onClose={() => setTokenModalOpen(false)}
        token={newToken}
        hostname={newHostname}
        serverId={newServerId}
      />

      {/* Delete confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Server</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{serverToDelete?.hostname}</strong>? 
            This will also remove its enrollment records.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={deleting} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
