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
  TextField,
  Button,
  Grid,
  Divider,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Messages = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages/inbox');
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await api.post('/messages', {
        recipientId: selectedConversation.senderId,
        content: newMessage,
        subject: selectedConversation.subject || 'Re: Message',
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`);
      fetchMessages();
      setSelectedConversation(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2, height: 'calc(100vh - 200px)' }}>
        {/* Message List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
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
                      selected={selectedConversation?.id === message.id}
                      onClick={() => setSelectedConversation(message)}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="primary"
                          variant="dot"
                          invisible={message.isRead}
                        >
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={message.subject || 'No Subject'}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {message.Sender?.firstName} {message.Sender?.lastName}
                            </Typography>
                            {' — '}
                            {message.content?.substring(0, 50)}...
                          </>
                        }
                        primaryTypographyProps={{
                          fontWeight: message.isRead ? 'normal' : 'bold',
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Message Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* Message Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">
                        {selectedConversation.subject || 'No Subject'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        From: {selectedConversation.Sender?.firstName}{' '}
                        {selectedConversation.Sender?.lastName} ({selectedConversation.Sender?.email})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(selectedConversation.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteMessage(selectedConversation.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Message Body */}
                <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedConversation.content}
                  </Typography>
                </Box>

                {/* Reply Section */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Type your reply..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send Reply
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Select a message to read
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Messages;

