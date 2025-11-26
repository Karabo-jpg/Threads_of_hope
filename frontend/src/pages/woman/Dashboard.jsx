import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as ProgressIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const WomanDashboard = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/training/my-enrollments');
      // Handle different response structures
      const data = response.data?.data || response.data || [];
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setEnrollments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProgressDialog = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setProgressValue(Number(enrollment.progress) || 0);
    setProgressDialogOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseProgressDialog = () => {
    setProgressDialogOpen(false);
    setSelectedEnrollment(null);
    setProgressValue(0);
    setError('');
    setSuccess('');
  };

  const handleProgressChange = (event, newValue) => {
    setProgressValue(newValue);
  };

  const handleProgressInputChange = (event) => {
    const value = Math.min(100, Math.max(0, parseInt(event.target.value) || 0));
    setProgressValue(value);
  };

  const handleUpdateProgress = async () => {
    if (!selectedEnrollment) return;

    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      await api.put(`/training/enrollments/${selectedEnrollment.id}/progress`, {
        progress: progressValue,
      });

      setSuccess('Progress updated successfully!');
      
      // Refresh enrollments to show updated progress
      await fetchEnrollments();
      
      // Close dialog after 1.5 seconds
      setTimeout(() => {
        handleCloseProgressDialog();
      }, 1500);
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err.response?.data?.message || 'Failed to update progress. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Ensure enrollments is always an array
  const enrollmentsList = Array.isArray(enrollments) ? enrollments : [];
  const activeEnrollments = enrollmentsList.filter(e => e && ['active', 'approved'].includes(e.status));
  const completedEnrollments = enrollmentsList.filter(e => e && e.status === 'completed');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Learning Journey
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track your progress and continue learning
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SchoolIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h4">{activeEnrollments.length}</Typography>
                  <Typography color="text.secondary">Active Programs</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrophyIcon fontSize="large" color="success" />
                <Box>
                  <Typography variant="h4">{completedEnrollments.length}</Typography>
                  <Typography color="text.secondary">Completed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ProgressIcon fontSize="large" color="secondary" />
                <Box>
                  <Typography variant="h4">
                    {activeEnrollments.length > 0
                      ? Math.round(
                          activeEnrollments.reduce((sum, e) => sum + (Number(e.progress) || 0), 0) /
                            activeEnrollments.length
                        )
                      : 0}
                    %
                  </Typography>
                  <Typography color="text.secondary">Avg Progress</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Active Programs</Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/woman/training')}
              >
                Browse Programs
              </Button>
            </Box>

            {activeEnrollments.length === 0 ? (
              <Typography color="text.secondary">
                No active enrollments. Browse available programs to get started!
              </Typography>
            ) : (
              activeEnrollments.map((enrollment) => (
                <Box key={enrollment.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {enrollment.program?.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {Number(enrollment.progress) || 0}%
                      </Typography>
                      <Tooltip title="Update Progress">
                        <IconButton
                          size="medium"
                          color="primary"
                          onClick={() => handleOpenProgressDialog(enrollment)}
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'white',
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Number(enrollment.progress) || 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Progress Update Dialog */}
      <Dialog
        open={progressDialogOpen}
        onClose={handleCloseProgressDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Progress
          {selectedEnrollment && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {selectedEnrollment.program?.title}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
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

          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>
              Progress: {progressValue}%
            </Typography>
            <Slider
              value={progressValue}
              onChange={handleProgressChange}
              min={0}
              max={100}
              step={1}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 100, label: '100%' },
              ]}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Progress Percentage"
              value={progressValue}
              onChange={handleProgressInputChange}
              inputProps={{ min: 0, max: 100 }}
              helperText="Enter a value between 0 and 100"
            />
          </Box>

          {progressValue === 100 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              When you reach 100%, your enrollment will be marked as completed and you'll receive a certificate!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProgressDialog} disabled={updating}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProgress}
            variant="contained"
            disabled={updating}
            sx={{ minWidth: 120 }}
          >
            {updating ? <CircularProgress size={24} /> : 'Update Progress'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WomanDashboard;


