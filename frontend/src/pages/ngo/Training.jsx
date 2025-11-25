import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Card, CardContent, Chip } from '@mui/material';
import { Add as AddIcon, School as SchoolIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Training = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/training');
      console.log('Training API response:', response.data);
      setPrograms(response.data.data.programs || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
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
          onClick={() => navigate('/training/create')}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <SchoolIcon color="primary" />
                    <Typography variant="h6">{program.title}</Typography>
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
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Training;

