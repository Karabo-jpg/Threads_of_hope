const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CollaborationRequest = sequelize.define('CollaborationRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'NGO requesting collaboration',
  },
  recipientId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'Specific NGO being invited (optional)',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  collaborationType: {
    type: DataTypes.ENUM(
      'joint_program',
      'resource_sharing',
      'expertise_sharing',
      'funding',
      'event',
      'advocacy',
      'research',
      'other'
    ),
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    comment: 'Expected duration of collaboration',
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  requiredSkills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  estimatedBudget: {
    type: DataTypes.DECIMAL(15, 2),
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  location: {
    type: DataTypes.STRING,
  },
  isRemote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'open',
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private', 'invited_only'),
    defaultValue: 'public',
  },
  documents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  responses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'collaboration_requests',
  timestamps: true,
  indexes: [
    { fields: ['requesterId'] },
    { fields: ['recipientId'] },
    { fields: ['status'] },
    { fields: ['collaborationType'] },
  ],
});

module.exports = CollaborationRequest;


