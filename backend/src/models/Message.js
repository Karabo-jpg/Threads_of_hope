const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  subject: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  messageType: {
    type: DataTypes.ENUM('direct', 'collaboration', 'support', 'notification'),
    defaultValue: 'direct',
  },
  relatedTo: {
    type: DataTypes.UUID,
    comment: 'Related entity ID (collaboration request, child, etc.)',
  },
  relatedType: {
    type: DataTypes.STRING,
    comment: 'Type of related entity',
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  readAt: {
    type: DataTypes.DATE,
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  archivedAt: {
    type: DataTypes.DATE,
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal',
  },
}, {
  tableName: 'messages',
  timestamps: true,
  indexes: [
    { fields: ['senderId'] },
    { fields: ['recipientId'] },
    { fields: ['isRead'] },
    { fields: ['createdAt'] },
  ],
});

module.exports = Message;


