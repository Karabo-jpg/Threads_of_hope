import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, MenuItem, Alert, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditProgram = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skillLevel: 'beginner',
    duration: '',
    maxParticipants: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/training/${id}`);
      const program = response.data?.data || response.data;
      
      setFormData({
        title: program.title || '',
        description: program.description || '',
        category: program.category || '',
        skillLevel: program.skillLevel || 'beginner',
        duration: program.duration || '',
        maxParticipants: program.maxParticipants || '',
        status: program.status || 'draft',
      });
    } catch (error) {
      console.error('Error fetching program:', error);
      setError('Failed to load program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    
    try {
      const programData = {
        ...formData,
        duration: parseInt(formData.duration),
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      };
      
      await api.put(`/training/${id}`, programData);
      setSuccess('Program updated successfully!');
      setTimeout(() => {
        navigate('/ngo/training');
      }, 1500);
    } catch (error) {
      console.error('Error updating program:', error);
      setError(error.response?.data?.message || 'Failed to update program');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/ngo/training')}
          sx={{ mb: 2 }}
        >
          Back to Programs
        </Button>
        <Typography variant="h4">Edit Training Program</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Program Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value="sewing">Sewing</MenuItem>
                <MenuItem value="tailoring">Tailoring</MenuItem>
                <MenuItem value="cooking">Cooking</MenuItem>
                <MenuItem value="baking">Baking</MenuItem>
                <MenuItem value="hairdressing">Hairdressing</MenuItem>
                <MenuItem value="beauty">Beauty</MenuItem>
                <MenuItem value="computer_skills">Computer Skills</MenuItem>
                <MenuItem value="business_management">Business Management</MenuItem>
                <MenuItem value="agriculture">Agriculture</MenuItem>
                <MenuItem value="handicrafts">Handicrafts</MenuItem>
                <MenuItem value="entrepreneurship">Entrepreneurship</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Skill Level"
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Duration (days)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Participants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                helperText="Set to 'active' to allow enrollments"
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="full">Full</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  sx={{ minWidth: 150 }}
                >
                  {saving ? <CircularProgress size={24} /> : 'Update Program'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/ngo/training')}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditProgram;

