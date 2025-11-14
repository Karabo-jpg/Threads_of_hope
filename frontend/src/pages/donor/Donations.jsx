import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Donations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get('/donations');
      console.log('Donations API response:', response.data);
      
      // Handle different response formats
      let donationsData = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          donationsData = response.data;
        } else if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            donationsData = response.data.data;
          } else if (response.data.data.donations && Array.isArray(response.data.data.donations)) {
            donationsData = response.data.data.donations;
          }
        } else if (response.data.donations && Array.isArray(response.data.donations)) {
          donationsData = response.data.donations;
        }
      }
      
      console.log('Setting donations to:', donationsData);
      setDonations(donationsData);
    } catch (error) {
      console.error('Error fetching donations:', error);
      console.error('Error details:', error.response?.data);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      pending: 'warning',
      failed: 'error',
      processing: 'info',
    };
    return colors[status] || 'default';
  };

  if (loading) return <LoadingSpinner />;

  // Extra safety check
  const donationsList = Array.isArray(donations) ? donations : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Donations</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/donor/donations/new')}
        >
          Make a Donation
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donationsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                    No donations yet. Start making a difference today!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              donationsList.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    {new Date(donation.donationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {donation.currency} {donation.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{donation.purpose || 'General Support'}</TableCell>
                  <TableCell>
                    {donation.recipientType === 'child' ? 'Child Support' : 
                     donation.recipientType === 'training' ? 'Training Program' : 
                     donation.recipientType === 'ngo' ? 'NGO' : 'General Fund'}
                  </TableCell>
                  <TableCell>{donation.paymentMethod}</TableCell>
                  <TableCell>
                    <Chip
                      label={donation.paymentStatus}
                      color={getStatusColor(donation.paymentStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => navigate(`/donor/donations/${donation.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Donations;

