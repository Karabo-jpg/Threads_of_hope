const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChildEvent = sequelize.define('ChildEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  childId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'children',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  recordedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  eventType: {
    type: DataTypes.ENUM(
      'health_checkup',
      'medical_treatment',
      'education_enrollment',
      'placement_change',
      'family_visit',
      'counseling_session',
      'legal_proceeding',
      'achievement',
      'incident',
      'status_update',
      'donation_received',
      'other'
    ),
    allowNull: false,
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  outcome: {
    type: DataTypes.TEXT,
  },
  attendees: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'Names of people who attended/were involved',
  },
  documents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'URLs to related documents/photos',
  },
  followUpRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  followUpDate: {
    type: DataTypes.DATE,
  },
  followUpNotes: {
    type: DataTypes.TEXT,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional structured data specific to event type',
  },
}, {
  tableName: 'child_events',
  timestamps: true,
  indexes: [
    { fields: ['childId'] },
    { fields: ['eventType'] },
    { fields: ['eventDate'] },
    { fields: ['recordedBy'] },
  ],
});

module.exports = ChildEvent;


