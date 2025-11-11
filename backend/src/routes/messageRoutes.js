const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Message validation
const messageValidation = [
  body('recipientId').isUUID(),
  body('content').notEmpty().trim(),
  validate,
];

// Routes
router.post('/', verifyToken, messageValidation, messageController.sendMessage);
router.get('/inbox', verifyToken, messageController.getInbox);
router.get('/sent', verifyToken, messageController.getSentMessages);
router.get('/unread-count', verifyToken, messageController.getUnreadCount);
router.get('/:id', verifyToken, messageController.getMessageById);
router.put('/:id/read', verifyToken, messageController.markAsRead);
router.put('/:id/archive', verifyToken, messageController.archiveMessage);

module.exports = router;


