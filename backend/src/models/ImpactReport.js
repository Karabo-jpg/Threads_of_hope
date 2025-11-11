const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ImpactReport = sequelize.define('ImpactReport', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  donationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'donations',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  reportedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'NGO user who created the report',
  },
  reportDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  reportingPeriod: {
    type: DataTypes.STRING,
    comment: 'e.g., "January 2024", "Q1 2024"',
  },
  amountUsed: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'education',
      'healthcare',
      'food',
      'shelter',
      'clothing',
      'training',
      'infrastructure',
      'administration',
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
  beneficiaries: {
    type: DataTypes.INTEGER,
    comment: 'Number of people benefited',
  },
  outcomes: {
    type: DataTypes.TEXT,
  },
  metrics: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Quantifiable metrics: {metric: value}',
  },
  challenges: {
    type: DataTypes.TEXT,
  },
  lessons: {
    type: DataTypes.TEXT,
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  documents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  receipts: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'reviewed', 'approved', 'rejected'),
    defaultValue: 'draft',
  },
  reviewedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  reviewedAt: {
    type: DataTypes.DATE,
  },
  reviewNotes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'impact_reports',
  timestamps: true,
  indexes: [
    { fields: ['donationId'] },
    { fields: ['reportedBy'] },
    { fields: ['reportDate'] },
    { fields: ['status'] },
  ],
});

module.exports = ImpactReport;


