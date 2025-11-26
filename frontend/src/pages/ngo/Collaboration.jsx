import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const Collaboration = () => {
  const navigate = useNavigate();
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [responding, setResponding] = useState(false);
  const [responseData, setResponseData] = useState({
    response: 'interested',
    message: '',
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/collaboration');
      console.log('Collaboration API response:', response.data);
      // Handle different response structures
      const data = response.data?.data || response.data;
      setCollaborations(data?.collaborations || data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching collaborations:', err);
      setError(err.response?.data?.message || 'Failed to load collaboration requests');
      setCollaborations([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'primary',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getTypeIcon = (type) => {
    const icons = {
      joint_program: <GroupIcon />,
      event: <EventIcon />,
      research: <AssessmentIcon />,
    };
    return icons[type] || <GroupIcon />;
  };

  const formatType = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleRespondClick = (collab) => {
    setSelectedCollaboration(collab);
    setResponseData({ response: 'interested', message: '' });
    setRespondDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setRespondDialogOpen(false);
    setSelectedCollaboration(null);
    setResponseData({ response: 'interested', message: '' });
    setError('');
    setSuccess('');
  };

  const handleResponseChange = (e) => {
    setResponseData({
      ...responseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitResponse = async () => {
    if (!responseData.message.trim()) {
      setError('Please provide a message');
      return;
    }

    try {
      setResponding(true);
      setError('');
      await api.post(`/collaboration/${selectedCollaboration.id}/respond`, {
        response: responseData.response,
        message: responseData.message,
      });
      setSuccess('Response submitted successfully!');
      // Refresh collaborations list
      await fetchCollaborations();
      // Close dialog after 1.5 seconds
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
    } catch (err) {
      console.error('Error submitting response:', err);
      setError(err.response?.data?.message || 'Failed to submit response. Please try again.');
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Collaboration Requests</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/ngo/collaboration/create')}
        >
          New Request
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {collaborations.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No collaboration requests
          </Typography>
          <Typography color="text.secondary">
            Connect with other NGOs to coordinate child welfare efforts
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {collaborations.map((collab) => (
            <Grid item xs={12} md={6} key={collab.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {collab.title}
                    </Typography>
                    <Chip
                      label={collab.status}
                      color={getStatusColor(collab.status)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getTypeIcon(collab.collaborationType)}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {formatType(collab.collaborationType)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {collab.description}
                  </Typography>

                  {collab.requester && (
                    <Typography variant="caption" color="text.secondary">
                      By: {collab.requester.firstName} {collab.requester.lastName}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {collab.responses || 0} responses • {collab.visibility}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      // For now, just show an alert. Can be expanded to a detail page later
                      alert(`Collaboration Details:\n\nTitle: ${collab.title}\n\nDescription: ${collab.description}\n\nType: ${formatType(collab.collaborationType)}\n\nStatus: ${collab.status}`);
                    }}
                  >
                    View Details
                  </Button>
                  {collab.status === 'open' && (
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => handleRespondClick(collab)}
                    >
                      Respond
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Respond Dialog */}
      <Dialog 
        open={respondDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Respond to Collaboration Request
        </DialogTitle>
        <DialogContent>
          {selectedCollaboration && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Collaboration:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {selectedCollaboration.title}
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Response Type</InputLabel>
            <Select
              name="response"
              value={responseData.response}
              onChange={handleResponseChange}
              label="Response Type"
            >
              <MenuItem value="interested">Interested</MenuItem>
              <MenuItem value="not_interested">Not Interested</MenuItem>
              <MenuItem value="need_more_info">Need More Information</MenuItem>
              <MenuItem value="conditional">Conditional Interest</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Your Message"
            name="message"
            value={responseData.message}
            onChange={handleResponseChange}
            required
            multiline
            rows={4}
            placeholder="Share your thoughts, questions, or conditions for collaboration..."
            helperText="Please provide details about your interest or any questions you have"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={responding}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitResponse} 
            variant="contained"
            disabled={responding || !responseData.message.trim()}
          >
            {responding ? <CircularProgress size={24} /> : 'Submit Response'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Collaboration;

