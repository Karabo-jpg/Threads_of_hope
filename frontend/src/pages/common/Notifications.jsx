import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
  Circle as CircleIcon,
  Favorite as FavoriteIcon,
  School as SchoolIcon,
  ChildCare as ChildCareIcon,
  Info as InfoIcon,
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
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      donation_received: <FavoriteIcon color="error" />,
      enrollment_approved: <SchoolIcon color="success" />,
      enrollment_rejected: <SchoolIcon color="error" />,
      child_update: <ChildCareIcon color="primary" />,
      training_started: <SchoolIcon color="info" />,
      training_completed: <SchoolIcon color="success" />,
      certificate_issued: <SchoolIcon color="success" />,
      message_received: <NotificationsIcon color="primary" />,
      system: <InfoIcon color="info" />,
    };
    return icons[type] || <NotificationsIcon />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'error',
      high: 'warning',
      normal: 'info',
      low: 'default',
    };
    return colors[priority] || 'default';
  };

  if (loading) return <LoadingSpinner />;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Notifications</Typography>
          {unreadCount > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<CheckIcon />}
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      <Paper>
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No notifications"
                secondary="You're all caught up!"
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={notification.isRead ? 'normal' : 'bold'}>
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                        )}
                        <Chip
                          label={notification.priority}
                          size="small"
                          color={getPriorityColor(notification.priority)}
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {notification.message}
                        </Typography>
                        <br />
                        <Typography component="span" variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!notification.isRead && (
                      <IconButton
                        edge="end"
                        aria-label="mark as read"
                        onClick={() => handleMarkAsRead(notification.id)}
                        size="small"
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteNotification(notification.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Notifications;

