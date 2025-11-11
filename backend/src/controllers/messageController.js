const { Message, User, Notification } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('../services/notificationService');

// Send message
exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, subject, content, messageType, relatedTo, relatedType, priority } = req.body;

    // Verify recipient exists
    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found',
      });
    }

    const message = await Message.create({
      senderId: req.user.id,
      recipientId,
      subject,
      content,
      messageType: messageType || 'direct',
      relatedTo,
      relatedType,
      priority: priority || 'normal',
    });

    // Notify recipient
    await createNotification(
      recipientId,
      'message_received',
      'New Message',
      `You have a new message from ${req.user.firstName} ${req.user.lastName}`,
      {
        relatedTo: message.id,
        relatedType: 'message',
        actionUrl: `/messages/${message.id}`,
        deliveryChannels: ['in_app', 'email'],
      }
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// Get inbox messages
exports.getInbox = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isRead, messageType } = req.query;

    const where = {
      recipientId: req.user.id,
      isArchived: false,
    };

    if (isRead !== undefined) where.isRead = isRead === 'true';
    if (messageType) where.messageType = messageType;

    const offset = (page - 1) * limit;

    const { count, rows } = await Message.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        messages: rows,
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

// Get sent messages
exports.getSentMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const where = {
      senderId: req.user.id,
      isArchived: false,
    };

    const offset = (page - 1) * limit;

    const { count, rows } = await Message.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        messages: rows,
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

// Get single message
exports.getMessageById = async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture'],
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture'],
        },
      ],
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Check access
    if (message.senderId !== req.user.id && message.recipientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Mark as read if recipient is viewing
    if (message.recipientId === req.user.id && !message.isRead) {
      await message.update({
        isRead: true,
        readAt: new Date(),
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// Mark message as read
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findOne({
      where: {
        id: req.params.id,
        recipientId: req.user.id,
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    await message.update({
      isRead: true,
      readAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// Archive message
exports.archiveMessage = async (req, res, next) => {
  try {
    const message = await Message.findOne({
      where: {
        id: req.params.id,
        [Op.or]: [
          { senderId: req.user.id },
          { recipientId: req.user.id },
        ],
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    await message.update({
      isArchived: true,
      archivedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Message archived',
    });
  } catch (error) {
    next(error);
  }
};

// Get unread count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const unreadMessages = await Message.count({
      where: {
        recipientId: req.user.id,
        isRead: false,
        isArchived: false,
      },
    });

    const unreadNotifications = await Notification.count({
      where: {
        userId: req.user.id,
        isRead: false,
      },
    });

    res.json({
      success: true,
      data: {
        messages: unreadMessages,
        notifications: unreadNotifications,
        total: unreadMessages + unreadNotifications,
      },
    });
  } catch (error) {
    next(error);
  }
};


