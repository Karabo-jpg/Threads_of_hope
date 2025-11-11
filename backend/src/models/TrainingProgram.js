const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingProgram = sequelize.define('TrainingProgram', {
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
    comment: 'NGO or Admin who created the program',
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
    type: DataTypes.ENUM(
      'sewing',
      'tailoring',
      'cooking',
      'baking',
      'hairdressing',
      'beauty',
      'computer_skills',
      'business_management',
      'agriculture',
      'handicrafts',
      'entrepreneurship',
      'other'
    ),
    allowNull: false,
  },
  skillLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner',
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in days',
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  schedule: {
    type: DataTypes.JSONB,
    comment: 'Schedule details: days, times, etc.',
  },
  location: {
    type: DataTypes.STRING,
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  onlinePlatform: {
    type: DataTypes.STRING,
  },
  curriculum: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of modules/lessons',
  },
  prerequisites: {
    type: DataTypes.TEXT,
  },
  certificationProvided: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  certificateName: {
    type: DataTypes.STRING,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  instructors: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  materials: {
    type: DataTypes.TEXT,
    comment: 'Materials/resources provided',
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  videoUrl: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'full', 'completed', 'cancelled'),
    defaultValue: 'draft',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  tableName: 'training_programs',
  timestamps: true,
  indexes: [
    { fields: ['createdBy'] },
    { fields: ['category'] },
    { fields: ['status'] },
    { fields: ['startDate'] },
  ],
});

module.exports = TrainingProgram;


