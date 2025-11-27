import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ChildCare as ChildCareIcon,
  School as SchoolIcon,
  Handshake as HandshakeIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NGODashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [childrenRes, donationsRes] = await Promise.all([
        api.get('/children/statistics'),
        api.get('/donations/statistics'),
      ]);
      
      console.log('Children Stats:', childrenRes.data);
      console.log('Donations Stats:', donationsRes.data);
      
      // Handle different response structures
      const childrenData = childrenRes.data?.data || childrenRes.data || {};
      const donationsData = donationsRes.data?.data || donationsRes.data || {};
      
      setStats({
        children: childrenData,
        donations: donationsData,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error details:', error.response?.data);
      setStats({
        children: { totalChildren: 0 },
        donations: { donationCount: 0, totalDonations: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        mb: 3 
      }}>
        <Typography variant="h4">
          NGO Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/ngo/children/register')}
          >
            Register Child
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/ngo/training/create')}
          >
            Create Program
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ChildCareIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h4">{stats?.children?.totalChildren || 0}</Typography>
                  <Typography color="text.secondary">Children Registered</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SchoolIcon fontSize="large" color="secondary" />
                <Box>
                  <Typography variant="h4">{stats?.donations?.donationCount || 0}</Typography>
                  <Typography color="text.secondary">Donations Received</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <HandshakeIcon fontSize="large" color="success" />
                <Box>
                  <Typography variant="h4">
                    ${parseFloat(stats?.donations?.totalDonations || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Typography>
                  <Typography color="text.secondary">Total Funds</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="outlined" onClick={() => navigate('/ngo/children')}>
                  View All Children
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={() => navigate('/ngo/training')}>
                  Manage Programs
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={() => navigate('/ngo/donations')}>
                  View Donations
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={() => navigate('/ngo/collaboration')}>
                  Collaboration Requests
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NGODashboard;


