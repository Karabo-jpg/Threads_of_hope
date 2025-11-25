import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Children = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Children Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Register Child
        </Button>
      </Box>

      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No children registered yet
        </Typography>
        <Typography color="text.secondary">
          Click "Register Child" to add a new child to the system
        </Typography>
      </Paper>
    </Box>
  );
};

export default Children;

