import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility as ViewIcon } from '@mui/icons-material';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ImpactReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/donations');
      // Filter for donations that have impact reports
      const donationsWithReports = response.data.data || [];
      // For now, show all donations as we'll add impact reports feature later
      setReports([]);
    } catch (error) {
      console.error('Error fetching impact reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Impact Reports
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        See the real impact of your donations and how they're changing lives.
      </Typography>

      {reports.length === 0 ? (
        <Card sx={{ mt: 3, p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No impact reports yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Impact reports will be generated once your donations are allocated and used.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {reports.map((report) => (
            <Grid item xs={12} md={6} lg={4} key={report.id}>
              <Card>
                {report.images && report.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={report.images[0]}
                    alt={report.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {report.summary?.substring(0, 150)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip
                      label={`${report.currency} ${report.amountUsed?.toLocaleString()}`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`${report.beneficiariesReached} beneficiaries`}
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Report Date: {new Date(report.reportDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => navigate(`/donor/impact/${report.id}`)}
                  >
                    View Full Report
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

export default ImpactReports;

