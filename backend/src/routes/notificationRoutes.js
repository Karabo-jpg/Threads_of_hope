const express = require('express');
const { verifyToken } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// Routes
router.get('/', verifyToken, notificationController.getNotifications);
router.get('/unread-count', verifyToken, notificationController.getNotificationUnreadCount);
router.put('/:id/read', verifyToken, notificationController.markNotificationAsRead);
router.put('/mark-all-read', verifyToken, notificationController.markAllNotificationsAsRead);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

module.exports = router;


