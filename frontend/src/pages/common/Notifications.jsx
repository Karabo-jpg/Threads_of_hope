import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      console.log('Notifications API response:', response.data);
      
      // Handle different response formats - ensure we always set an array
      let notificationsData = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          notificationsData = response.data;
        } else if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            notificationsData = response.data.data;
          } else if (response.data.data.notifications && Array.isArray(response.data.data.notifications)) {
            notificationsData = response.data.data.notifications;
          }
        } else if (response.data.notifications && Array.isArray(response.data.notifications)) {
          notificationsData = response.data.notifications;
        }
      }
      
      console.log('Setting notifications to:', notificationsData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      console.error('Error details:', error.response?.data);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'donation_received':
      case 'donation_allocated':
        return <CheckCircleIcon color="success" />;
      case 'enrollment_approved':
      case 'training_completed':
        return <CheckCircleIcon color="primary" />;
      case 'enrollment_rejected':
        return <WarningIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) return <LoadingSpinner />;

  // Extra safety check - ensure notifications is always an array
  const notificationsList = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notificationsList.filter((n) => !n.isRead).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Notifications
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread`}
              color="primary"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        {unreadCount > 0 && (
          <Button variant="outlined" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </Box>

      <Paper>
        <List>
          {notificationsList.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No notifications"
                secondary="You're all caught up!"
              />
            </ListItem>
          ) : (
            notificationsList.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={notification.isRead ? 400 : 600}>
                          {notification.title}
                        </Typography>
                        {notification.priority && notification.priority !== 'normal' && (
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority)}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" component="span">
                          {notification.message}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  {!notification.isRead && (
                    <Button
                      size="small"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </ListItem>
                {index < notificationsList.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Notifications;

