const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NGOProfile = sequelize.define('NGOProfile', {
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
  organizationName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registrationNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  organizationType: {
    type: DataTypes.ENUM('ngo', 'charity', 'foundation', 'community_org', 'other'),
    defaultValue: 'ngo',
  },
  website: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  foundedYear: {
    type: DataTypes.INTEGER,
  },
  logo: {
    type: DataTypes.STRING,
  },
  certificationDocuments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  focusAreas: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'e.g., child_welfare, education, health, women_empowerment',
  },
  numberOfStaff: {
    type: DataTypes.INTEGER,
  },
  numberOfVolunteers: {
    type: DataTypes.INTEGER,
  },
  annualBudget: {
    type: DataTypes.DECIMAL(15, 2),
  },
  bankAccountName: {
    type: DataTypes.STRING,
  },
  bankAccountNumber: {
    type: DataTypes.STRING,
  },
  bankName: {
    type: DataTypes.STRING,
  },
  bankSwiftCode: {
    type: DataTypes.STRING,
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending',
  },
  verifiedAt: {
    type: DataTypes.DATE,
  },
  verifiedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'ngo_profiles',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['registrationNumber'] },
    { fields: ['verificationStatus'] },
  ],
});

module.exports = NGOProfile;


