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
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedMessage) return;

    try {
      await api.post('/messages', {
        recipientId: selectedMessage.senderId,
        subject: `RE: ${selectedMessage.subject}`,
        content: reply,
      });
      setReply('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            <List>
              {messages.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No messages"
                    secondary="Your inbox is empty"
                  />
                </ListItem>
              ) : (
                messages.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem
                      button
                      selected={selectedMessage?.id === message.id}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {message.senderName?.charAt(0) || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={message.subject || 'No Subject'}
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" component="span">
                              {message.senderName || 'Unknown Sender'}
                            </Typography>
                            <br />
                            {new Date(message.createdAt).toLocaleDateString()}
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
                From: {selectedMessage.senderName || 'Unknown'}
                <br />
                Date: {new Date(selectedMessage.createdAt).toLocaleString()}
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

