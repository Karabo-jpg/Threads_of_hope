import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Collaboration = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Collaboration Requests</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Request
        </Button>
      </Box>

      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No collaboration requests
        </Typography>
        <Typography color="text.secondary">
          Connect with other NGOs to coordinate child welfare efforts
        </Typography>
      </Paper>
    </Box>
  );
};

export default Collaboration;

