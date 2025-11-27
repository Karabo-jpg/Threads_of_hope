import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon, Edit as EditIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Messages = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [women, setWomen] = useState([]);
  const [loadingWomen, setLoadingWomen] = useState(false);
  const [composeData, setComposeData] = useState({
    recipientId: '',
    subject: '',
    content: '',
  });
  const [composeError, setComposeError] = useState('');
  const [composeSuccess, setComposeSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // Fetch women users when compose dialog opens (only for admin and NGO)
    if (composeOpen && (user?.role === 'admin' || user?.role === 'ngo')) {
      console.log('Compose dialog opened, fetching women users...');
      fetchWomen();
    } else if (composeOpen) {
      console.log('Compose dialog opened but user role is not admin or NGO:', user?.role);
    }
  }, [composeOpen, user?.role]);

  const fetchWomen = async () => {
    console.log('fetchWomen called');
    setLoadingWomen(true);
    setWomen([]); // Clear previous data
    try {
      // Use general users endpoint (accessible to both admin and NGO)
      console.log('Fetching women from /users endpoint...');
      const response = await api.get('/users?role=woman&isApproved=true&isActive=true&limit=100');
      console.log('Women users response:', response.data);
      const users = response.data?.data || [];
      console.log('Setting women users:', users.length, 'users found');
      setWomen(users);
    } catch (error) {
      console.error('Error fetching women users:', error);
      console.error('Error response:', error.response?.data);
      setComposeError(`Failed to load recipients: ${error.response?.data?.message || error.message}`);
      setWomen([]);
    } finally {
      setLoadingWomen(false);
    }
  };

  const handleOpenCompose = () => {
    console.log('Opening compose dialog, user role:', user?.role);
    setComposeOpen(true);
    setComposeData({ recipientId: '', subject: '', content: '' });
    setComposeError('');
    setComposeSuccess(false);
    // Explicitly fetch women when opening (in addition to useEffect)
    if (user?.role === 'admin' || user?.role === 'ngo') {
      fetchWomen();
    }
  };

  const handleCloseCompose = () => {
    setComposeOpen(false);
    setComposeData({ recipientId: '', subject: '', content: '' });
    setComposeError('');
    setComposeSuccess(false);
  };

  const handleComposeChange = (e) => {
    const { name, value } = e.target;
    setComposeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendNewMessage = async () => {
    if (!composeData.recipientId || !composeData.subject.trim() || !composeData.content.trim()) {
      setComposeError('Please fill in all fields');
      return;
    }

    setSending(true);
    setComposeError('');
    setComposeSuccess(false);

    try {
      await api.post('/messages', {
        recipientId: composeData.recipientId,
        subject: composeData.subject,
        content: composeData.content,
        messageType: 'direct',
        priority: 'normal',
      });

      setComposeSuccess(true);
      // Refresh messages
      await fetchMessages();
      // Close dialog after a short delay
      setTimeout(() => {
        handleCloseCompose();
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setComposeError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      console.log('Messages API response:', response.data);
      
      // Backend returns: { success: true, data: { messages: [...], pagination: {...} } }
      const data = response.data?.data || response.data;
      const messagesData = data?.messages || data || [];
      
      // Ensure messages is always an array
      const messagesList = Array.isArray(messagesData) ? messagesData : [];
      
      console.log('Setting messages to:', messagesList);
      setMessages(messagesList);
    } catch (error) {
      console.error('Error fetching messages:', error);
      console.error('Error details:', error.response?.data);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedMessage) return;

    try {
      const senderId = selectedMessage.senderId || selectedMessage.sender?.id;
      if (!senderId) {
        console.error('Cannot send reply: sender ID not found');
        return;
      }

      await api.post('/messages', {
        recipientId: senderId,
        subject: `RE: ${selectedMessage.subject || 'Message'}`,
        content: reply,
      });
      setReply('');
      // Refresh messages after sending
      await fetchMessages();
      // Mark current message as read if not already
      if (!selectedMessage.isRead && selectedMessage.id) {
        try {
          await api.put(`/messages/${selectedMessage.id}/read`);
        } catch (err) {
          console.error('Error marking message as read:', err);
        }
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Extra safety check - ensure messages is always an array
  const messagesList = Array.isArray(messages) ? messages : [];

  // Check if user can compose messages (admin or NGO only)
  const canCompose = user?.role === 'admin' || user?.role === 'ngo';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Messages
        </Typography>
        {canCompose && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleOpenCompose}
          >
            Compose New Message
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            <List>
              {messagesList.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No messages"
                    secondary="Your inbox is empty"
                  />
                </ListItem>
              ) : (
                messagesList.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem
                      button
                      selected={selectedMessage?.id === message.id}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {message.sender?.firstName?.charAt(0) || 
                           message.senderName?.charAt(0) || 
                           'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={message.subject || 'No Subject'}
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" component="span">
                              {message.sender 
                                ? `${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim() || message.sender.email
                                : message.senderName || 'Unknown Sender'}
                            </Typography>
                            <br />
                            {new Date(message.createdAt).toLocaleDateString()}
                            {!message.isRead && (
                              <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                                (Unread)
                              </Typography>
                            )}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedMessage ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedMessage.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                From: {selectedMessage.sender 
                  ? `${selectedMessage.sender.firstName || ''} ${selectedMessage.sender.lastName || ''}`.trim() || selectedMessage.sender.email
                  : selectedMessage.senderName || 'Unknown'}
                <br />
                Date: {new Date(selectedMessage.createdAt).toLocaleString()}
                {selectedMessage.messageType && (
                  <>
                    <br />
                    Type: {selectedMessage.messageType}
                  </>
                )}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                {selectedMessage.content}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
              />
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSendReply}
                sx={{ mt: 2 }}
              >
                Send Reply
              </Button>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', height: '70vh' }}>
              <Typography variant="body1" color="text.secondary">
                Select a message to view
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Compose New Message Dialog */}
      <Dialog 
        open={composeOpen} 
        onClose={handleCloseCompose} 
        maxWidth="sm" 
        fullWidth
        onEnter={() => {
          console.log('Dialog entered, fetching women users...');
          if (user?.role === 'admin' || user?.role === 'ngo') {
            fetchWomen();
          }
        }}
      >
        <DialogTitle>Compose New Message</DialogTitle>
        <DialogContent>
          {composeError && !composeError.includes('Failed to load recipients') && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setComposeError('')}>
              {composeError}
            </Alert>
          )}
          {composeError && composeError.includes('Failed to load recipients') && (
            <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setComposeError('')}>
              {composeError}
            </Alert>
          )}
          {composeSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Message sent successfully!
            </Alert>
          )}

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Select Recipient (Woman)</InputLabel>
            <Select
              name="recipientId"
              value={composeData.recipientId}
              onChange={handleComposeChange}
              label="Select Recipient (Woman)"
              disabled={loadingWomen || sending}
            >
              {loadingWomen ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">Loading women users...</Typography>
                  </Box>
                </MenuItem>
              ) : women.length === 0 ? (
                <MenuItem disabled>
                  {composeError && composeError.includes('Failed to load recipients') 
                    ? 'Error loading recipients. Please try again.' 
                    : 'No women users found'}
                </MenuItem>
              ) : (
                women.map((woman) => (
                  <MenuItem key={woman.id} value={woman.id}>
                    {`${woman.firstName || ''} ${woman.lastName || ''}`.trim() || woman.email}
                    {woman.email && ` (${woman.email})`}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            required
            name="subject"
            label="Subject"
            value={composeData.subject}
            onChange={handleComposeChange}
            disabled={sending}
          />

          <TextField
            fullWidth
            margin="normal"
            required
            name="content"
            label="Message"
            multiline
            rows={6}
            value={composeData.content}
            onChange={handleComposeChange}
            placeholder="Type your message here..."
            disabled={sending}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompose} disabled={sending}>
            Cancel
          </Button>
          <Button
            onClick={handleSendNewMessage}
            variant="contained"
            startIcon={<SendIcon />}
            disabled={sending || !composeData.recipientId || !composeData.subject.trim() || !composeData.content.trim()}
          >
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Messages;

