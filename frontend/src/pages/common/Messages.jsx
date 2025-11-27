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
  Tabs,
  Tab,
} from '@mui/material';
import { Send as SendIcon, Edit as EditIcon, Inbox as InboxIcon, Send as SentIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useMediaQuery, useTheme } from '@mui/material';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Messages = () => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0 = Inbox, 1 = Sent
  const [composeOpen, setComposeOpen] = useState(false);
  const [women, setWomen] = useState([]);
  const [recipients, setRecipients] = useState([]); // For donors: admins and NGOs
  const [loadingWomen, setLoadingWomen] = useState(false);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
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
  }, [activeTab]); // Refetch when tab changes

  useEffect(() => {
    // Fetch recipients when compose dialog opens
    if (composeOpen) {
      if (user?.role === 'admin' || user?.role === 'ngo') {
        console.log('Compose dialog opened, fetching women users...');
        fetchWomen();
      } else if (user?.role === 'donor') {
        console.log('Compose dialog opened, fetching message recipients for donor...');
        fetchMessageRecipients();
      }
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

  const fetchMessageRecipients = async () => {
    console.log('fetchMessageRecipients called');
    setLoadingRecipients(true);
    setRecipients([]); // Clear previous data
    try {
      // Fetch admins and NGOs for donors
      console.log('Fetching message recipients from /donations/message-recipients endpoint...');
      const response = await api.get('/donations/message-recipients');
      console.log('Message recipients response:', response.data);
      const data = response.data?.data || {};
      const allRecipients = [
        ...(data.admins || []).map(admin => ({ ...admin, role: 'admin' })),
        ...(data.ngos || []).map(ngo => ({ ...ngo, role: 'ngo' })),
      ];
      console.log('Setting recipients:', allRecipients.length, 'recipients found');
      setRecipients(allRecipients);
    } catch (error) {
      console.error('Error fetching message recipients:', error);
      console.error('Error response:', error.response?.data);
      setComposeError(`Failed to load recipients: ${error.response?.data?.message || error.message}`);
      setRecipients([]);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const handleOpenCompose = () => {
    console.log('Opening compose dialog, user role:', user?.role);
    setComposeOpen(true);
    setComposeData({ recipientId: '', subject: '', content: '' });
    setComposeError('');
    setComposeSuccess(false);
    // Explicitly fetch recipients when opening (in addition to useEffect)
    if (user?.role === 'admin' || user?.role === 'ngo') {
      fetchWomen();
    } else if (user?.role === 'donor') {
      fetchMessageRecipients();
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
      // Refresh messages (switch to sent tab and refresh)
      setActiveTab(1); // Switch to Sent tab
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
    setLoading(true);
    try {
      // Fetch based on active tab: 0 = Inbox, 1 = Sent
      const endpoint = activeTab === 0 ? '/messages/inbox' : '/messages/sent';
      const response = await api.get(endpoint);
      console.log(`${activeTab === 0 ? 'Inbox' : 'Sent'} messages API response:`, response.data);
      
      // Backend returns: { success: true, data: { messages: [...], pagination: {...} } }
      const data = response.data?.data || response.data;
      const messagesData = data?.messages || data || [];
      
      // Ensure messages is always an array
      const messagesList = Array.isArray(messagesData) ? messagesData : [];
      
      console.log(`Setting ${activeTab === 0 ? 'inbox' : 'sent'} messages to:`, messagesList);
      setMessages(messagesList);
      // Clear selected message when switching tabs
      setSelectedMessage(null);
      setReply('');
    } catch (error) {
      console.error(`Error fetching ${activeTab === 0 ? 'inbox' : 'sent'} messages:`, error);
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
      // Refresh messages after sending (stay on current tab)
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

  // Check if user can compose messages (admin, NGO, or donor)
  const canCompose = user?.role === 'admin' || user?.role === 'ngo' || user?.role === 'donor';

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 },
        mb: 2 
      }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
          Messages
        </Typography>
        {canCompose && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleOpenCompose}
            size={isMobile ? 'small' : 'medium'}
            fullWidth={isMobile}
            sx={{ minHeight: { xs: '44px', sm: 'auto' } }} // Ensure touch target is large enough
          >
            {isMobile ? 'Compose' : 'Compose New Message'}
          </Button>
        )}
      </Box>

      {/* Tabs for Inbox and Sent */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<InboxIcon />} iconPosition="start" label="Inbox" />
          <Tab icon={<SentIcon />} iconPosition="start" label="Sent" />
        </Tabs>
      </Paper>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4} sx={{ 
          order: { xs: selectedMessage ? 2 : 1, md: 1 },
          display: { xs: selectedMessage ? 'none' : 'block', md: 'block' }
        }}>
          <Paper sx={{ 
            maxHeight: { xs: '50vh', md: '70vh' }, 
            overflow: 'auto'
          }}>
            <List>
              {loading ? (
                <ListItem>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 2 }}>
                    <CircularProgress />
                  </Box>
                </ListItem>
              ) : messagesList.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary={`No ${activeTab === 0 ? 'inbox' : 'sent'} messages`}
                    secondary={`Your ${activeTab === 0 ? 'inbox is' : 'sent messages folder is'} empty`}
                  />
                </ListItem>
              ) : (
                messagesList.map((message) => {
                  // For inbox: show sender, for sent: show recipient
                  const displayUser = activeTab === 0 
                    ? (message.sender || { firstName: message.senderName, email: 'Unknown' })
                    : (message.recipient || { firstName: message.recipientName, email: 'Unknown' });
                  
                  const displayName = activeTab === 0
                    ? (message.sender 
                        ? `${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim() || message.sender.email
                        : message.senderName || 'Unknown Sender')
                    : (message.recipient
                        ? `${message.recipient.firstName || ''} ${message.recipient.lastName || ''}`.trim() || message.recipient.email
                        : message.recipientName || 'Unknown Recipient');

                  return (
                    <React.Fragment key={message.id}>
                      <ListItem
                        button
                        selected={selectedMessage?.id === message.id}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {displayUser?.firstName?.charAt(0) || 
                             displayUser?.email?.charAt(0) || 
                             'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={message.subject || 'No Subject'}
                          secondary={
                            <React.Fragment>
                              <Typography variant="body2" component="span">
                                {activeTab === 0 ? 'From: ' : 'To: '}
                                {displayName}
                              </Typography>
                              <br />
                              {new Date(message.createdAt).toLocaleDateString()}
                              {activeTab === 0 && !message.isRead && (
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
                  );
                })
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} sx={{ 
          order: { xs: selectedMessage ? 1 : 2, md: 2 }
        }}>
          {selectedMessage ? (
            <Paper sx={{ 
              p: { xs: 2, sm: 3 },
              position: 'relative'
            }}>
              {/* Back button for mobile/tablet */}
              {isTablet && (
                <Button
                  onClick={() => setSelectedMessage(null)}
                  sx={{ mb: 2, minHeight: '44px' }}
                  size="small"
                >
                  ← Back to Messages
                </Button>
              )}
              <Typography variant="h6" gutterBottom>
                {selectedMessage.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {activeTab === 0 ? (
                  <>
                    From: {selectedMessage.sender 
                      ? `${selectedMessage.sender.firstName || ''} ${selectedMessage.sender.lastName || ''}`.trim() || selectedMessage.sender.email
                      : selectedMessage.senderName || 'Unknown'}
                  </>
                ) : (
                  <>
                    To: {selectedMessage.recipient
                      ? `${selectedMessage.recipient.firstName || ''} ${selectedMessage.recipient.lastName || ''}`.trim() || selectedMessage.recipient.email
                      : selectedMessage.recipientName || 'Unknown'}
                  </>
                )}
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
              {/* Only show reply section for inbox messages */}
              {activeTab === 0 && (
                <>
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
                </>
              )}
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
        fullScreen={isMobile} // Full screen on mobile
        onEnter={() => {
          console.log('Dialog entered, fetching recipients...');
          if (user?.role === 'admin' || user?.role === 'ngo') {
            fetchWomen();
          } else if (user?.role === 'donor') {
            fetchMessageRecipients();
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
            <InputLabel>
              {user?.role === 'donor' ? 'Select Recipient' : 'Select Recipient (Woman)'}
            </InputLabel>
            <Select
              name="recipientId"
              value={composeData.recipientId}
              onChange={handleComposeChange}
              label={user?.role === 'donor' ? 'Select Recipient' : 'Select Recipient (Woman)'}
              disabled={(loadingWomen || loadingRecipients) || sending}
            >
              {(loadingWomen || loadingRecipients) ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">
                      {user?.role === 'donor' ? 'Loading recipients...' : 'Loading women users...'}
                    </Typography>
                  </Box>
                </MenuItem>
              ) : (user?.role === 'donor' ? recipients : women).length === 0 ? (
                <MenuItem disabled>
                  {composeError && composeError.includes('Failed to load recipients') 
                    ? 'Error loading recipients. Please try again.' 
                    : user?.role === 'donor' ? 'No recipients found' : 'No women users found'}
                </MenuItem>
              ) : (
                (user?.role === 'donor' ? recipients : women).map((recipient) => (
                  <MenuItem key={recipient.id} value={recipient.id}>
                    <Box>
                      <Typography variant="body2">
                        {`${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || recipient.email}
                        {recipient.role && ` (${recipient.role.toUpperCase()})`}
                        {recipient.hasDonated && ' ✓'}
                      </Typography>
                      {recipient.email && (
                        <Typography variant="caption" color="text.secondary">
                          {recipient.email}
                        </Typography>
                      )}
                    </Box>
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

