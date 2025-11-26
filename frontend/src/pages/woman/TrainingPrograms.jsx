import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const TrainingPrograms = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/training', {
        params: { status: 'active' },
      });
      // Some backends wrap data differently; support both
      const data = response.data?.data || response.data;
      setPrograms(Array.isArray(data) ? data : data?.programs || []);
      setError('');
    } catch (err) {
      console.error('Error fetching training programs:', err);
      setError('Failed to load training programs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (programId) => {
    try {
      setEnrollingId(programId);
      setError('');
      setSuccess('');
      await api.post(`/training/${programId}/enroll`);
      setSuccess('Successfully enrolled in program!');
      // Refresh programs list
      await fetchPrograms();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error enrolling in program:', err);
      const message =
        err.response?.data?.message || 'Failed to enroll in program. Please try again.';
      setError(message);
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Training Programs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse available programs and enroll to start your learning journey.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate('/woman')}>
          Back to Dashboard
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {programs.length === 0 ? (
        <Typography color="text.secondary">
          No training programs are available yet. Please check back later.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {programs.map((program) => (
            <Grid item xs={12} md={6} lg={4} key={program.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                    <SchoolIcon color="primary" />
                    <Typography variant="h6">{program.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {program.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Chip
                      icon={<CategoryIcon />}
                      label={program.category}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<ScheduleIcon />}
                      label={`${program.duration || 0} days`}
                      size="small"
                      variant="outlined"
                    />
                    {program.skillLevel && (
                      <Chip label={program.skillLevel} size="small" variant="outlined" />
                    )}
                  </Box>

                  {program.cost > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Cost: {program.cost} {program.currency || 'USD'}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleEnroll(program.id)}
                    disabled={enrollingId === program.id || program.status !== 'active'}
                  >
                    {enrollingId === program.id ? 'Enrolling...' : 'Enroll'}
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

export default TrainingPrograms;


