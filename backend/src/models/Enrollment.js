const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  programId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'training_programs',
      key: 'id',
    },
    onDelete: 'CASCADE',
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
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'active', 'completed', 'dropped', 'failed'),
    defaultValue: 'pending',
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  approvedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  approvedAt: {
    type: DataTypes.DATE,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  completionDate: {
    type: DataTypes.DATE,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
    comment: 'Progress percentage (0-100)',
  },
  attendanceRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    comment: 'Attendance percentage',
  },
  assessmentScores: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of {assessment, score, date}',
  },
  overallGrade: {
    type: DataTypes.STRING,
  },
  certificateIssued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  certificateUrl: {
    type: DataTypes.STRING,
  },
  certificateIssuedDate: {
    type: DataTypes.DATE,
  },
  proofOfProgress: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'URLs to uploaded proof documents/images',
  },
  feedback: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'enrollments',
  timestamps: true,
  indexes: [
    { fields: ['programId'] },
    { fields: ['userId'] },
    { fields: ['status'] },
    { unique: true, fields: ['programId', 'userId'] },
  ],
});

module.exports = Enrollment;


