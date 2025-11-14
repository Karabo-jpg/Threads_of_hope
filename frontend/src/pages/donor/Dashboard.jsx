import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Favorite as FavoriteIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/donations/statistics');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Donor Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/donor/donations/new')}
        >
          Make a Donation
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FavoriteIcon fontSize="large" color="error" />
                <Box>
                  <Typography variant="h4">
                    ${stats?.totalDonations?.toLocaleString() || 0}
                  </Typography>
                  <Typography color="text.secondary">Total Donated</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon fontSize="large" color="success" />
                <Box>
                  <Typography variant="h4">
                    ${stats?.totalAllocated?.toLocaleString() || 0}
                  </Typography>
                  <Typography color="text.secondary">Funds Allocated</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AssessmentIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h4">{stats?.impactReportsCount || 0}</Typography>
                  <Typography color="text.secondary">Impact Reports</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Impact
            </Typography>
            <Typography variant="body1" paragraph>
              Thank you for your generous contributions to Threads of Hope. Your donations
              are making a real difference in the lives of children and women in our communities.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/donor/donations')}>
                View All Donations
              </Button>
              <Button variant="outlined" onClick={() => navigate('/donor/impact')}>
                View Impact Reports
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DonorDashboard;


