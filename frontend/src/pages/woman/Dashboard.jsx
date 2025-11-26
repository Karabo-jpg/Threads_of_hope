import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Button, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as ProgressIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const WomanDashboard = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/training/my-enrollments');
      setEnrollments(response.data.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const activeEnrollments = enrollments.filter(e => ['active', 'approved'].includes(e.status));
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');

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
                          activeEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {enrollment.program?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {enrollment.progress || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={enrollment.progress || 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WomanDashboard;


