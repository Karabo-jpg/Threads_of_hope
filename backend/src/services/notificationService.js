const { Notification, User } = require('../models');
const { sendEmail } = require('./emailService');
const { sendNotificationSMS } = require('./smsService');

// Create and send notification
const createNotification = async (userId, type, title, message, options = {}) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedTo: options.relatedTo,
      relatedType: options.relatedType,
      actionUrl: options.actionUrl,
      priority: options.priority || 'normal',
      deliveryChannels: options.deliveryChannels || ['in_app'],
      metadata: options.metadata || {},
    });

    // Send via configured channels
    const user = await User.findByPk(userId);
    if (!user) return notification;

    const channels = options.deliveryChannels || ['in_app'];

    // Send email if configured
    if (channels.includes('email') && user.email && user.emailVerified) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${title}</h2>
          <p>${message}</p>
          ${options.actionUrl ? `<div style="margin: 20px 0;"><a href="${process.env.FRONTEND_URL}${options.actionUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Details</a></div>` : ''}
          <p>Best regards,<br>Threads of Hope Team</p>
        </div>
      `;

      const emailResult = await sendEmail(user.email, title, message, emailHtml);
      await notification.update({ emailSent: emailResult.success });
    }

    // Send SMS if configured
    if (channels.includes('sms') && user.phoneNumber && user.phoneVerified) {
      const smsResult = await sendNotificationSMS(user.phoneNumber, notification);
      await notification.update({ smsSent: smsResult.success });
    }

    // Push notifications would be handled by Socket.io in real-time
    if (channels.includes('push')) {
      // Emit socket event (handled in socket.io setup)
      const io = require('../app').io;
      if (io) {
        io.to(`user_${userId}`).emit('notification', notification);
      }
      await notification.update({ pushSent: true });
    }

    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
    throw error;
  }
};

// Bulk notifications
const createBulkNotifications = async (userIds, type, title, message, options = {}) => {
  const promises = userIds.map(userId => 
    createNotification(userId, type, title, message, options)
  );
  return await Promise.allSettled(promises);
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  await notification.update({
    isRead: true,
    readAt: new Date(),
  });

  return notification;
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
  await Notification.update(
    { isRead: true, readAt: new Date() },
    { where: { userId, isRead: false } }
  );
};

// Get unread count
const getUnreadCount = async (userId) => {
  return await Notification.count({
    where: { userId, isRead: false },
  });
};

module.exports = {
  createNotification,
  createBulkNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};


