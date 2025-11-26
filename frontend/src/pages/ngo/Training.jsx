import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Card, CardContent, CardActions, Chip, IconButton, Tooltip } from '@mui/material';
import { 
  Add as AddIcon, 
  School as SchoolIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Training = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/training');
      console.log('Training API response:', response.data);
      // Handle different response structures
      const data = response.data?.data || response.data;
      setPrograms(data?.programs || data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      active: 'success',
      full: 'warning',
      completed: 'info',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const canEditProgram = (program) => {
    // Admin can edit any program, NGO can only edit their own
    return user?.role === 'admin' || program.createdBy === user?.id;
  };

  const handleActivate = async (programId) => {
    try {
      setActivatingId(programId);
      await api.put(`/training/${programId}`, { status: 'active' });
      // Refresh programs list
      await fetchPrograms();
    } catch (error) {
      console.error('Error activating program:', error);
      alert(error.response?.data?.message || 'Failed to activate program');
    } finally {
      setActivatingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Training Programs</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/ngo/training/create')}
        >
          Create Program
        </Button>
      </Box>

      {programs.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No training programs available
          </Typography>
          <Typography color="text.secondary">
            Click "Create Program" to add a new training program
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {programs.map((program) => (
            <Grid item xs={12} sm={6} md={4} key={program.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      <SchoolIcon color="primary" />
                      <Typography variant="h6">{program.title}</Typography>
                    </Box>
                    <Chip 
                      label={program.status || 'draft'} 
                      size="small" 
                      color={getStatusColor(program.status)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    {program.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={program.category} size="small" color="primary" />
                    <Chip label={program.skillLevel} size="small" />
                    <Chip label={`${program.duration} days`} size="small" />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Participants: {program.currentParticipants || 0}
                      {program.maxParticipants && ` / ${program.maxParticipants}`}
                    </Typography>
                  </Box>
                </CardContent>
                {canEditProgram(program) && (
                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    {program.status === 'draft' && (
                      <Tooltip title="Activate Program">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleActivate(program.id)}
                          disabled={activatingId === program.id}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit Program">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/ngo/training/edit/${program.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Training;

