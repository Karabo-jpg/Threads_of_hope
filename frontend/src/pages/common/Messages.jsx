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
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

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
    </Box>
  );
};

export default Messages;

