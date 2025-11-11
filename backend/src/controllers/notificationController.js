const { Notification } = require('../models');
const { markAsRead, markAllAsRead, getUnreadCount } = require('../services/notificationService');

// Get all notifications for user
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isRead, type } = req.query;

    const where = { userId: req.user.id };

    if (isRead !== undefined) where.isRead = isRead === 'true';
    if (type) where.type = type;

    const offset = (page - 1) * limit;

    const { count, rows } = await Notification.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        notifications: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    await markAsRead(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
exports.markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await markAllAsRead(req.user.id);

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// Get unread count
exports.getNotificationUnreadCount = async (req, res, next) => {
  try {
    const count = await getUnreadCount(req.user.id);

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    next(error);
  }
};


