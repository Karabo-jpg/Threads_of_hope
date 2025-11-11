const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');

const router = express.Router();

// Registration validation
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('role').isIn(['admin', 'ngo', 'woman', 'donor']),
  validate,
];

// Login validation
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/request-password-reset', passwordResetLimiter, authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;


