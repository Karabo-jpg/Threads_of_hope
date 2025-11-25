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
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';

const Collaboration = () => {
  const navigate = useNavigate();
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/collaboration');
      setCollaborations(response.data.data.collaborations || []);
      setError('');
    } catch (err) {
      console.error('Error fetching collaborations:', err);
      setError('Failed to load collaboration requests');
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
                    onClick={() => navigate(`/ngo/collaboration/${collab.id}`)}
                  >
                    View Details
                  </Button>
                  <Button size="small" color="primary">
                    Respond
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Collaboration;

