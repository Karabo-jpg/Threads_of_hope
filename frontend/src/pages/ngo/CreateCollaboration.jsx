import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import api from '../../services/api';

const CreateCollaboration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    collaborationType: '',
    expectedOutcomes: '',
    resourcesNeeded: '',
    timeline: '',
    visibility: 'public',
  });

  const collaborationTypes = [
    { value: 'joint_program', label: 'Joint Program' },
    { value: 'resource_sharing', label: 'Resource Sharing' },
    { value: 'expertise_sharing', label: 'Expertise Sharing' },
    { value: 'funding', label: 'Funding' },
    { value: 'event', label: 'Event' },
    { value: 'advocacy', label: 'Advocacy' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.title || !formData.description || !formData.collaborationType) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/collaboration', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/ngo/collaboration');
      }, 2000);
    } catch (err) {
      console.error('Error creating collaboration:', err);
      setError(err.response?.data?.message || 'Failed to create collaboration request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/ngo/collaboration')}
          sx={{ mb: 2 }}
        >
          Back to Collaborations
        </Button>
        <Typography variant="h4">Create Collaboration Request</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Collaboration request created successfully! Redirecting...
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="e.g., Joint Skills Training Program"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            margin="normal"
            placeholder="Describe your collaboration proposal..."
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Collaboration Type</InputLabel>
            <Select
              name="collaborationType"
              value={formData.collaborationType}
              onChange={handleChange}
              label="Collaboration Type"
            >
              {collaborationTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Expected Outcomes"
            name="expectedOutcomes"
            value={formData.expectedOutcomes}
            onChange={handleChange}
            multiline
            rows={3}
            margin="normal"
            placeholder="What do you hope to achieve?"
          />

          <TextField
            fullWidth
            label="Resources Needed"
            name="resourcesNeeded"
            value={formData.resourcesNeeded}
            onChange={handleChange}
            multiline
            rows={3}
            margin="normal"
            placeholder="What resources or support do you need?"
          />

          <TextField
            fullWidth
            label="Timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            margin="normal"
            placeholder="e.g., 3 months, Starting January 2024"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Visibility</InputLabel>
            <Select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              label="Visibility"
            >
              <MenuItem value="public">Public - Visible to all NGOs</MenuItem>
              <MenuItem value="private">Private - Invite only</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Request'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/ngo/collaboration')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCollaboration;

