const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  resourceType: {
    type: DataTypes.ENUM(
      'training_material',
      'document',
      'guide',
      'template',
      'event',
      'opportunity',
      'collaboration_request',
      'other'
    ),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  fileUrl: {
    type: DataTypes.STRING,
  },
  fileType: {
    type: DataTypes.STRING,
  },
  fileSize: {
    type: DataTypes.INTEGER,
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
  },
  externalLink: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  targetAudience: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'e.g., ["ngo", "woman", "donor"]',
  },
  accessLevel: {
    type: DataTypes.ENUM('public', 'verified_users', 'ngo_only', 'private'),
    defaultValue: 'verified_users',
  },
  language: {
    type: DataTypes.ENUM('en', 'sw', 'fr', 'multiple'),
    defaultValue: 'en',
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  publishedAt: {
    type: DataTypes.DATE,
  },
  expiresAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'resources',
  timestamps: true,
  indexes: [
    { fields: ['createdBy'] },
    { fields: ['resourceType'] },
    { fields: ['accessLevel'] },
    { fields: ['isActive'] },
  ],
});

module.exports = Resource;


