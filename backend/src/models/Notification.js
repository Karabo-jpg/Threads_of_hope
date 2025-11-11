const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM(
      'donation_received',
      'donation_allocated',
      'impact_report',
      'enrollment_approved',
      'enrollment_rejected',
      'training_started',
      'training_completed',
      'certificate_issued',
      'child_update',
      'collaboration_invite',
      'collaboration_response',
      'message_received',
      'user_approved',
      'user_rejected',
      'system',
      'other'
    ),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  relatedTo: {
    type: DataTypes.UUID,
    comment: 'ID of related entity (donation, enrollment, etc.)',
  },
  relatedType: {
    type: DataTypes.STRING,
    comment: 'Type of related entity',
  },
  actionUrl: {
    type: DataTypes.STRING,
    comment: 'URL to navigate when notification is clicked',
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal',
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  readAt: {
    type: DataTypes.DATE,
  },
  deliveryChannels: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['in_app'],
    comment: 'in_app, email, sms, push',
  },
  emailSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  smsSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  pushSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['type'] },
    { fields: ['isRead'] },
    { fields: ['createdAt'] },
    { fields: ['priority'] },
  ],
});

module.exports = Notification;


