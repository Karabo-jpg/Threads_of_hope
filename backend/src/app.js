const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { errorHandler, notFound, logger } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { auditLogger } = require('./middleware/auditLog');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
app.use('/api/', apiLimiter);

// Audit logging
app.use(auditLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/children', require('./routes/childRoutes'));
app.use('/api/training', require('./routes/trainingRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/collaboration', require('./routes/collaborationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// API documentation
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Threads of Hope API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      children: '/api/children',
      training: '/api/training',
      donations: '/api/donations',
      collaboration: '/api/collaboration',
      messages: '/api/messages',
      notifications: '/api/notifications',
      admin: '/api/admin',
    },
    documentation: '/api/docs',
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Database connection test
testConnection();

module.exports = app;


