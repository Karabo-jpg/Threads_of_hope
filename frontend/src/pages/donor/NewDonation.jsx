import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const NewDonation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [ngos, setNgos] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    purpose: '',
    recipientType: 'general',
    recipientId: null,
    ngoId: null,
    paymentMethod: 'credit_card',
    isRecurring: false,
    isAnonymous: false,
    message: '',
  });

  useEffect(() => {
    if (formData.recipientType === 'ngo') {
      fetchNGOs();
    }
  }, [formData.recipientType]);

  const fetchNGOs = async () => {
    try {
      const response = await api.get('/donations/recipients/ngo');
      setNgos(response.data.data || []);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert amount to number
      const donationData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      
      const response = await api.post('/donations', donationData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/donor/donations');
      }, 2000);
    } catch (err) {
      console.error('Donation error:', err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Make a Donation
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Thank you for your donation! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  label="Currency"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="KES">KES (Kenyan Shilling)</MenuItem>
                  <MenuItem value="TZS">TZS (Tanzanian Shilling)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="e.g., Education support, Medical care, Skills training"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Donation Type</InputLabel>
                <Select
                  name="recipientType"
                  value={formData.recipientType}
                  onChange={handleChange}
                  label="Donation Type"
                >
                  <MenuItem value="general">General Fund</MenuItem>
                  <MenuItem value="child">Support a Child</MenuItem>
                  <MenuItem value="woman">Support Women Empowerment</MenuItem>
                  <MenuItem value="program">Training Program</MenuItem>
                  <MenuItem value="ngo">Support an NGO</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.recipientType === 'ngo' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Select NGO</InputLabel>
                  <Select
                    name="ngoId"
                    value={formData.ngoId || ''}
                    onChange={handleChange}
                    label="Select NGO"
                  >
                    {ngos.length === 0 ? (
                      <MenuItem value="" disabled>No NGOs available</MenuItem>
                    ) : (
                      ngos.map((ngo) => (
                        <MenuItem key={ngo.id} value={ngo.id}>
                          {ngo.firstName} {ngo.lastName}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  label="Payment Method"
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="debit_card">Debit Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="mobile_money">Mobile Money</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message (Optional)"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Add a message of support..."
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Donate Now'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/donor/donations')}
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

export default NewDonation;

