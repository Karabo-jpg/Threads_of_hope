const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Child = sequelize.define('Child', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  registeredBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'NGO user who registered this child',
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middleName: {
    type: DataTypes.STRING,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false,
  },
  profilePhoto: {
    type: DataTypes.STRING,
  },
  birthCertificateNumber: {
    type: DataTypes.STRING,
  },
  nationality: {
    type: DataTypes.STRING,
  },
  ethnicity: {
    type: DataTypes.STRING,
  },
  bloodType: {
    type: DataTypes.STRING,
  },
  currentStatus: {
    type: DataTypes.ENUM(
      'orphan',
      'vulnerable',
      'rescued',
      'in_care',
      'adopted',
      'reunited',
      'independent'
    ),
    allowNull: false,
    defaultValue: 'vulnerable',
  },
  currentLocation: {
    type: DataTypes.STRING,
  },
  currentPlacement: {
    type: DataTypes.STRING,
    comment: 'Orphanage, foster home, etc.',
  },
  
  // Guardian Information
  guardianName: {
    type: DataTypes.STRING,
  },
  guardianRelationship: {
    type: DataTypes.STRING,
  },
  guardianPhone: {
    type: DataTypes.STRING,
  },
  guardianAddress: {
    type: DataTypes.TEXT,
  },
  
  // Medical Information
  medicalConditions: {
    type: DataTypes.TEXT,
  },
  allergies: {
    type: DataTypes.TEXT,
  },
  disabilities: {
    type: DataTypes.TEXT,
  },
  vaccinations: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of {vaccine, date, location}',
  },
  lastMedicalCheckup: {
    type: DataTypes.DATE,
  },
  
  // Education Information
  educationLevel: {
    type: DataTypes.STRING,
  },
  schoolName: {
    type: DataTypes.STRING,
  },
  grade: {
    type: DataTypes.STRING,
  },
  academicPerformance: {
    type: DataTypes.TEXT,
  },
  specialNeeds: {
    type: DataTypes.TEXT,
  },
  
  // Background Information
  familyBackground: {
    type: DataTypes.TEXT,
  },
  circumstancesLeadingToRescue: {
    type: DataTypes.TEXT,
  },
  traumaHistory: {
    type: DataTypes.TEXT,
  },
  psychologicalSupport: {
    type: DataTypes.TEXT,
  },
  
  // Case Management
  caseNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  rescueDate: {
    type: DataTypes.DATE,
  },
  rescueLocation: {
    type: DataTypes.STRING,
  },
  legalStatus: {
    type: DataTypes.STRING,
  },
  courtCaseReference: {
    type: DataTypes.STRING,
  },
  
  // Additional Fields
  notes: {
    type: DataTypes.TEXT,
  },
  documents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'URLs to uploaded documents',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  archivedAt: {
    type: DataTypes.DATE,
  },
  archivedReason: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'children',
  timestamps: true,
  indexes: [
    { fields: ['registeredBy'] },
    { fields: ['currentStatus'] },
    { fields: ['caseNumber'] },
    { fields: ['isActive'] },
    { fields: ['dateOfBirth'] },
  ],
});

module.exports = Child;


