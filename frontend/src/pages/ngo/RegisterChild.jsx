import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterChild = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    currentStatus: 'vulnerable',
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
      const response = await api.post('/children', formData);
      // Show success message
      alert('Child registered successfully!');
      // Navigate to the correct children page (NGO route)
      navigate('/ngo/children');
    } catch (error) {
      console.error('Error registering child:', error);
      alert(error.response?.data?.message || 'Failed to register child');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Register Child
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Current Status"
                name="currentStatus"
                value={formData.currentStatus}
                onChange={handleChange}
              >
                <MenuItem value="orphan">Orphan</MenuItem>
                <MenuItem value="vulnerable">Vulnerable</MenuItem>
                <MenuItem value="rescued">Rescued</MenuItem>
                <MenuItem value="in_care">In Care</MenuItem>
                <MenuItem value="adopted">Adopted</MenuItem>
                <MenuItem value="reunited">Reunited</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register Child'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/ngo/children')}
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

export default RegisterChild;

