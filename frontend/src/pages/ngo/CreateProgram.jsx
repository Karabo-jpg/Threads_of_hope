import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateProgram = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skillLevel: 'beginner',
    duration: '',
    maxParticipants: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const programData = {
        ...formData,
        duration: parseInt(formData.duration),
        maxParticipants: parseInt(formData.maxParticipants),
      };
      
      await api.post('/training', programData);
      alert('Training program created successfully!');
      navigate('/training');
    } catch (error) {
      console.error('Error creating program:', error);
      alert(error.response?.data?.message || 'Failed to create program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Training Program
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
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

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Program'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/training')}
                  disabled={loading}
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

export default CreateProgram;

