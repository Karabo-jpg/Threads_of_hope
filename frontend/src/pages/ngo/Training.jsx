import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Training = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Training Programs</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Program
        </Button>
      </Box>

      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No training programs available
        </Typography>
        <Typography color="text.secondary">
          Click "Create Program" to add a new training program
        </Typography>
      </Paper>
    </Box>
  );
};

export default Training;

