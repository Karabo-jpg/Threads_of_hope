const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'User who performed the action',
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., CREATE, UPDATE, DELETE, LOGIN, LOGOUT',
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of entity affected (User, Child, Donation, etc.)',
  },
  entityId: {
    type: DataTypes.UUID,
    comment: 'ID of the entity affected',
  },
  oldValues: {
    type: DataTypes.JSONB,
    comment: 'Previous values (for UPDATE operations)',
  },
  newValues: {
    type: DataTypes.JSONB,
    comment: 'New values (for CREATE and UPDATE operations)',
  },
  ipAddress: {
    type: DataTypes.STRING,
  },
  userAgent: {
    type: DataTypes.STRING,
  },
  requestMethod: {
    type: DataTypes.STRING,
    comment: 'HTTP method (GET, POST, PUT, DELETE, etc.)',
  },
  requestUrl: {
    type: DataTypes.STRING,
  },
  statusCode: {
    type: DataTypes.INTEGER,
  },
  errorMessage: {
    type: DataTypes.TEXT,
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Request duration in milliseconds',
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional context-specific data',
  },
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['action'] },
    { fields: ['entityType'] },
    { fields: ['entityId'] },
    { fields: ['createdAt'] },
    { fields: ['ipAddress'] },
  ],
});

module.exports = AuditLog;


