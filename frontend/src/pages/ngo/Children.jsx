import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Children = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/children');
      console.log('Children API response:', response.data);
      // Handle different response structures
      const data = response.data?.data || response.data;
      setChildren(data?.children || data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Children Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/ngo/children/register')}
        >
          Register Child
        </Button>
      </Box>

      {children.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No children registered yet
          </Typography>
          <Typography color="text.secondary">
            Click "Register Child" to add a new child to the system
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {children.map((child) => (
                <TableRow key={child.id}>
                  <TableCell>{child.caseNumber}</TableCell>
                  <TableCell>{child.firstName} {child.lastName}</TableCell>
                  <TableCell>
                    {child.dateOfBirth ? 
                      Math.floor((new Date() - new Date(child.dateOfBirth)) / 365.25 / 24 / 60 / 60 / 1000) 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{child.gender}</TableCell>
                  <TableCell>
                    <Chip 
                      label={child.currentStatus} 
                      size="small" 
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(child.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Children;

